'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { supabase } from '@/lib/supabase'; // Supabase client
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check the current session when the component is mounted
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    // Set up an auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      // Redirect to login if the user is logged out
      if (!session && event !== 'SIGNED_IN') {
        console.log('here')
        router.push('/auth/login');
      }
    });

    // Get the session when component mounts
    getSession();

    // Cleanup the auth listener when component unmounts
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe(); // Safely unsubscribe if listener exists
      }
    };
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <header>
          <nav>
            <Link href="/">Home</Link>
            {session ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/auth/login');
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login">Login</Link>
            )}
          </nav>
        </header> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
