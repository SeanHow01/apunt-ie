'use client';

import { FiReUpCard } from '@/components/home/FiReUpCard';
import { createClient } from '@/lib/supabase/client';

type Props = {
  userId: string;
  completed: boolean;
  completedAt: string | null;
};

export default function HomeFireUpAttest({ userId, completed, completedAt }: Props) {
  async function handleAttest() {
    const supabase = createClient();
    await supabase.from('fireup_completions').upsert({
      user_id: userId,
      self_attested_at: new Date().toISOString(),
    });
  }

  return (
    <FiReUpCard
      completed={completed}
      completedAt={completedAt}
      onAttest={handleAttest}
    />
  );
}
