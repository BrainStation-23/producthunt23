
-- Function to search products by name, tagline or description
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  result_limit INT DEFAULT 5
)
RETURNS SETOF products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE 
    status = 'approved' AND
    (
      name ILIKE '%' || search_query || '%' OR
      tagline ILIKE '%' || search_query || '%' OR
      description ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE 
      WHEN name ILIKE search_query || '%' THEN 1
      WHEN name ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    upvotes DESC,
    created_at DESC
  LIMIT result_limit;
END;
$$;

-- Grant access to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION search_products TO anon, authenticated;
