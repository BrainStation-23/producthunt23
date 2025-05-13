import ExcelJS from 'exceljs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Sanitize worksheet names for Excel compliance
function sanitizeSheetName(name: string): string {
  // Remove illegal characters
  let sanitized = name.replace(/[\\\/\*\[\]\:\?]/g, '');

  // Trim and truncate to 31 characters
  sanitized = sanitized.trim().substring(0, 31);

  // Use default if empty
  if (!sanitized) return 'Sheet';

  // Avoid reserved names
  if (sanitized.toLowerCase() === 'history') return 'Sheet_History';

  return sanitized;
}

export async function exportProductScoring(productId: string, productName: string) {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Product Judging Platform';
    workbook.created = new Date();

    // Fetch all judges who have evaluated this product
    const { data: judgeAssignments, error: assignmentsError } = await supabase
      .from('judge_assignments')
      .select('judge_id')
      .eq('product_id', productId);

    if (assignmentsError) throw assignmentsError;

    if (!judgeAssignments || judgeAssignments.length === 0) {
      toast.error('No judges assigned to this product');
      return;
    }

    const judgeIds = [...new Set(judgeAssignments.map(ja => ja.judge_id))];

    const { data: judgeProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .in('id', judgeIds);

    if (profilesError) throw profilesError;

    const { data: criteria, error: criteriaError } = await supabase
      .from('judging_criteria')
      .select('*')
      .order('name', { ascending: true });

    if (criteriaError) throw criteriaError;

    const { data: submissions, error: submissionsError } = await supabase
      .from('judging_submissions')
      .select('*')
      .eq('product_id', productId);

    if (submissionsError) throw submissionsError;

    const { data: evaluations, error: evaluationsError } = await supabase
      .from('judging_evaluations')
      .select('judge_id, notes')
      .eq('product_id', productId);

    if (evaluationsError) throw evaluationsError;

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Criteria', key: 'criteria', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Average Score', key: 'avgScore', width: 15 },
      { header: 'Yes Count', key: 'yesCount', width: 15 },
      { header: 'No Count', key: 'noCount', width: 15 },
    ];

    const headerRow = summarySheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    criteria.forEach(criterion => {
      const criteriaSubmissions = submissions.filter(s => s.criteria_id === criterion.id);

      if (criterion.type === 'rating') {
        const validRatings = criteriaSubmissions
          .filter(sub => sub.rating_value !== null)
          .map(sub => sub.rating_value);

        const avgRating = validRatings.length > 0
          ? validRatings.reduce((sum, val) => sum + (val || 0), 0) / validRatings.length
          : null;

        summarySheet.addRow({
          criteria: criterion.name,
          type: 'Rating',
          avgScore: avgRating ? avgRating.toFixed(2) : 'N/A',
          yesCount: '-',
          noCount: '-'
        });
      } else if (criterion.type === 'boolean') {
        const trueCount = criteriaSubmissions.filter(sub => sub.boolean_value === true).length;
        const falseCount = criteriaSubmissions.filter(sub => sub.boolean_value === false).length;

        summarySheet.addRow({
          criteria: criterion.name,
          type: 'Yes/No',
          avgScore: '-',
          yesCount: trueCount,
          noCount: falseCount
        });
      }
    });

    const judgesScoringData = [];

    judgeProfiles?.forEach(judge => {
      const judgeSubmissions = submissions.filter(sub => sub.judge_id === judge.id);
      const judgeNotes = evaluations?.find(e => e.judge_id === judge.id)?.notes || null;

      const formattedSubmissions = judgeSubmissions.map(sub => {
        const criteriaInfo = criteria.find(c => c.id === sub.criteria_id);

        return {
          criteriaId: sub.criteria_id,
          criteriaName: criteriaInfo?.name || 'Unknown',
          criteriaType: criteriaInfo?.type || 'Unknown',
          criteriaDescription: criteriaInfo?.description || null,
          ratingValue: sub.rating_value,
          booleanValue: sub.boolean_value,
          textValue: sub.text_value
        };
      });

      judgesScoringData.push({
        judgeId: judge.id,
        judgeName: judge.username || 'Unknown',
        judgeEmail: judge.email || 'Unknown',
        submissions: formattedSubmissions,
        notes: judgeNotes
      });
    });

    judgesScoringData.forEach(judgeData => {
      const sheetName = sanitizeSheetName(`Judge: ${judgeData.judgeName}`);
      const judgeSheet = workbook.addWorksheet(sheetName);

      judgeSheet.addRow(['Judge Information']);
      judgeSheet.addRow(['Name:', judgeData.judgeName]);
      judgeSheet.addRow(['Email:', judgeData.judgeEmail]);
      judgeSheet.addRow([]);

      judgeSheet.addRow(['Evaluations']);
      judgeSheet.addRow(['Criteria', 'Type', 'Score/Value', 'Description']);

      const judgeHeaderRow = judgeSheet.getRow(6);
      judgeHeaderRow.font = { bold: true };
      judgeHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };

      criteria.forEach(criterion => {
        const submission = judgeData.submissions.find(sub => sub.criteriaId === criterion.id);
        let value: string | number | boolean = 'Not evaluated';

        if (submission) {
          if (criterion.type === 'rating' && submission.ratingValue !== null) {
            value = submission.ratingValue;
          } else if (criterion.type === 'boolean' && submission.booleanValue !== null) {
            value = submission.booleanValue ? 'Yes' : 'No';
          } else if (criterion.type === 'text' && submission.textValue) {
            value = submission.textValue;
          }
        }

        judgeSheet.addRow([
          criterion.name,
          criterion.type.charAt(0).toUpperCase() + criterion.type.slice(1),
          value,
          criterion.description || ''
        ]);
      });

      judgeSheet.addRow([]);
      judgeSheet.addRow(['Notes']);
      judgeSheet.addRow([judgeData.notes || 'No notes provided']);

      judgeSheet.columns = [
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 40 },
      ];

      [1, 5, judgeSheet.rowCount - 1].forEach(rowIndex => {
        const row = judgeSheet.getRow(rowIndex);
        row.font = { bold: true, size: 14 };
        row.height = 20;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-judging-results.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Excel export completed successfully');
  } catch (error) {
    console.error('Error exporting Excel:', error);
    toast.error('Failed to export Excel file');
  }
}
