-- Add Full-Text Search to "messages" table
-- 1. Create a GIN index for the text column
CREATE INDEX IF NOT EXISTS messages_text_fts_idx ON public.messages USING GIN (to_tsvector('arabic', COALESCE(text, '')));

-- 2. Create the RPC function for searching
CREATE OR REPLACE FUNCTION search_messages(query_text TEXT)
RETURNS SETOF public.messages AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.messages
    WHERE to_tsvector('arabic', COALESCE(text, '')) @@ websearch_to_tsquery('arabic', query_text)
    ORDER BY ts_rank(to_tsvector('arabic', COALESCE(text, '')), websearch_to_tsquery('arabic', query_text)) DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
