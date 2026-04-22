'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { READING_WPM } from '@/lib/constants';

// Helper: verify caller is admin
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Not admin');
  return { supabase, userId: user.id };
}

// Helper: insert a version record
async function insertVersion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  article: { title: string; summary: string; content_md: string },
  sourceType: string,
  userId: string,
) {
  const { data: existing } = await supabase
    .from('article_versions')
    .select('version_number')
    .eq('article_id', articleId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (existing?.version_number ?? 0) + 1;
  await supabase.from('article_versions').insert({
    article_id: articleId,
    version_number: nextVersion,
    title: article.title,
    summary: article.summary,
    content_md: article.content_md,
    source_type: sourceType,
    edited_by: userId,
  });
}

export type ArticleFormData = {
  title: string;
  slug: string;
  summary: string;
  content_md: string;
  category: string;
  article_type: string;
  related_module_ids: string[];
  sources: Array<{ title: string; url: string; publication: string; date: string }>;
  reading_minutes: number;
};

export async function createArticle(data: ArticleFormData): Promise<{ id: string }> {
  const { supabase, userId } = await requireAdmin();

  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      ...data,
      sources: data.sources,
      status: 'draft',
      created_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  await insertVersion(supabase, article.id, data, 'manual_draft', userId);
  revalidatePath('/admin/news');
  revalidatePath('/news');

  return { id: article.id };
}

export async function updateArticle(id: string, data: ArticleFormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();

  const { error } = await supabase
    .from('articles')
    .update({ ...data, sources: data.sources, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);

  await insertVersion(supabase, id, data, 'manual_edit', userId);
  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function publishArticle(id: string, data: ArticleFormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();

  // Save current content first
  await supabase
    .from('articles')
    .update({
      ...data,
      sources: data.sources,
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  await insertVersion(supabase, id, data, 'published', userId);
  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath(`/news/${data.slug}`);
}

export async function unpublishArticle(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from('articles')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id);
  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function archiveArticle(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from('articles')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id);
  revalidatePath('/admin/news');
}

export async function deleteArticle(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.from('articles').delete().eq('id', id);
  revalidatePath('/admin/news');
  revalidatePath('/news');
}

export async function restoreVersion(versionId: string, articleId: string): Promise<void> {
  const { supabase, userId } = await requireAdmin();

  const { data: version } = await supabase
    .from('article_versions')
    .select('title, summary, content_md')
    .eq('id', versionId)
    .single();

  if (!version) throw new Error('Version not found');

  const wordCount = version.content_md.trim().split(/\s+/).length;
  const reading_minutes = Math.max(1, Math.round(wordCount / READING_WPM));

  await supabase
    .from('articles')
    .update({
      title: version.title,
      summary: version.summary,
      content_md: version.content_md,
      reading_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId);

  await insertVersion(supabase, articleId, version, 'manual_edit', userId);
  revalidatePath('/admin/news');
}
