'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Await the result of getSession()
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard'); // Redirect to dashboard if the user is logged in
      }
    };

    checkSession();
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Next.js App</h1>
      <p>This is the homepage of your app.</p>
      <p>
        {`Please `}
        <a href="/auth/login">login</a>
        {` to access your dashboard.`}
      </p>
    </div>
  );
}
