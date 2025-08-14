-- Create stored procedure to create stories that bypasses RLS
CREATE OR REPLACE FUNCTION create_story(
  p_user_id UUID,
  p_title TEXT,
  p_summary TEXT,
  p_tags TEXT[]
) RETURNS TABLE(
  id UUID,
  title TEXT,
  summary TEXT,
  tags TEXT[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  INSERT INTO anchor_stories (user_id, title, summary, tags)
  VALUES (p_user_id, p_title, p_summary, p_tags)
  RETURNING anchor_stories.id, anchor_stories.title, anchor_stories.summary, anchor_stories.tags;
END;
$$; 