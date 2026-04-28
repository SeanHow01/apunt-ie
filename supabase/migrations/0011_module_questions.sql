-- Module questions: users can ask a question after completing a lesson.
-- Questions are stored per-user per-module; no limit on submissions.

CREATE TABLE IF NOT EXISTS public.module_questions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id     text        NOT NULL,
  question      text        NOT NULL CHECK (char_length(question) BETWEEN 5 AND 500),
  submitted_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.module_questions ENABLE ROW LEVEL SECURITY;

-- Authenticated users may insert their own questions
CREATE POLICY "Users insert own questions"
  ON public.module_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users may read their own questions
CREATE POLICY "Users read own questions"
  ON public.module_questions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_module_questions_user
  ON public.module_questions (user_id, module_id);
