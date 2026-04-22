import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArticleEditForm } from './ArticleEditForm';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select(
      'id, slug, title, summary, content_md, category, article_type, related_module_ids, sources, status, reading_minutes, published_at',
    )
    .eq('id', id)
    .single();

  if (error || !article) notFound();

  // sources is stored as JSONB — cast to the expected shape
  const typedArticle = {
    ...article,
    sources: article.sources as Array<{
      title: string;
      url: string;
      publication: string;
      date: string;
    }> | null,
  };

  return <ArticleEditForm article={typedArticle} />;
}
