
// Follow Deno's recommended pattern for handling requests in Supabase Edge Functions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure constants
const BUCKET_NAME = 'product_screenshots';
const BATCH_SIZE = 50; // Process files in batches to avoid timeouts

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body to get parameters
    let params = {}; 
    try {
      if (req.method === "POST") {
        params = await req.json();
      }
    } catch (e) {
      console.error("Error parsing request body:", e);
    }

    // Extract the dry run parameter (default to true for safety)
    const dryRun = params.dryRun !== false;
    console.log(`Running in ${dryRun ? 'dry run' : 'deletion'} mode`);

    // Start time for performance measurement
    const startTime = Date.now();
    
    // Step 1: Get all files from storage
    console.log("Listing all files in storage bucket...");
    const { data: storageFiles, error: storageError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list();

    if (storageError) {
      throw new Error(`Failed to list files in storage: ${storageError.message}`);
    }

    if (!storageFiles || storageFiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No files found in storage bucket', filesChecked: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${storageFiles.length} files in storage`);

    // Step 2: Get all image URLs from the database
    console.log("Fetching image URLs from database...");
    const { data: dbRecords, error: dbError } = await supabase
      .from('product_screenshots')
      .select('image_url');

    if (dbError) {
      throw new Error(`Failed to query database records: ${dbError.message}`);
    }

    // Extract URLs and create a normalized set for easy lookup
    const dbUrls = new Set();
    for (const record of dbRecords || []) {
      if (record.image_url) {
        // Extract the filename part from the URL for comparison
        try {
          const urlParts = record.image_url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
          if (urlParts.length === 2) {
            const filePath = decodeURIComponent(urlParts[1]);
            dbUrls.add(filePath);
          }
        } catch (e) {
          console.error(`Error processing URL ${record.image_url}:`, e);
        }
      }
    }

    console.log(`Found ${dbUrls.size} image URLs in database`);

    // Step 3: Find orphaned files
    const orphanedFiles = storageFiles.filter(file => !dbUrls.has(file.name));
    console.log(`Identified ${orphanedFiles.length} orphaned files`);

    // Step 4: Delete orphaned files (if not in dry-run mode)
    const deletedFiles = [];
    const failedDeletions = [];
    
    if (orphanedFiles.length > 0) {
      // Process files in batches to avoid timeouts
      for (let i = 0; i < orphanedFiles.length; i += BATCH_SIZE) {
        const batch = orphanedFiles.slice(i, i + BATCH_SIZE);
        const filePaths = batch.map(file => file.name);
        
        if (!dryRun) {
          console.log(`Deleting batch ${i/BATCH_SIZE + 1} (${filePaths.length} files)...`);
          const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .remove(filePaths);
          
          if (error) {
            console.error(`Error deleting batch: ${error.message}`);
            failedDeletions.push(...batch);
          } else {
            deletedFiles.push(...batch);
          }
        } else {
          // In dry-run mode, just log what would be deleted
          console.log(`Would delete ${filePaths.length} files in batch ${i/BATCH_SIZE + 1}`);
          // Add to deleted files for reporting purposes
          deletedFiles.push(...batch);
        }
      }

      // Log the cleanup operation to system_logs if not in dry-run mode
      if (!dryRun) {
        const { error: logError } = await supabase.rpc('add_system_log', {
          service: 'Storage Cleanup',
          log_type: 'info',
          message: `Deleted ${deletedFiles.length} orphaned image files from ${BUCKET_NAME} bucket`,
          details: { 
            deleted_count: deletedFiles.length,
            failed_count: failedDeletions.length,
            bucket_name: BUCKET_NAME,
            duration_ms: Date.now() - startTime
          },
          severity: 'medium'
        });

        if (logError) {
          console.error('Error logging cleanup operation:', logError);
        }
      }
    }

    // Calculate total size of orphaned files
    const totalSizeBytes = orphanedFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    // Build response
    const response = {
      totalFiles: storageFiles.length,
      databaseRecords: dbUrls.size,
      orphanedFiles: orphanedFiles.length,
      filesDeleted: dryRun ? 0 : deletedFiles.length,
      totalSizeRecovered: `${totalSizeMB} MB`,
      dryRun,
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)} seconds`,
      sampleOrphanedFiles: orphanedFiles.slice(0, 10).map(file => ({
        name: file.name,
        size: file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(2)} KB` : 'Unknown',
        lastModified: file.metadata?.lastModified || 'Unknown'
      })),
      errors: failedDeletions.length > 0 ? `Failed to delete ${failedDeletions.length} files` : null
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup-orphaned-images function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
