'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader } from 'react-feather';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state to control rendering

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard'); // Redirect to dashboard if the user is logged in
      } else {
        router.push('/auth/login'); // Redirect to login if not logged in
      }
    };

    checkSession().finally(() => setIsLoading(false)); // Ensure loading state updates after session check
  }, [router]);

  if (isLoading) {
    return  <div className="flex justify-center items-center mt-4">
              <Loader className="animate-spin" size={50} />
            </div>
  }

  return null; // Since we're redirecting, no content needs to be rendered
}
