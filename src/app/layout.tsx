'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { supabase } from '@/lib/supabase'; // Supabase client
import { useRouter } from 'next/navigation';
import './globals.css';
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] });
import { Session as SupabaseSession } from '@supabase/supabase-js';


export default function Layout({ children }: { children: React.ReactNode }) {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, setSession] = useState<SupabaseSession | null>(null); // Use Session or null
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
      <Toaster
           toastOptions={{
            success: {
              style: {
                border: "1px solid #4ade80", // Light green border
                padding: "16px",
                color: "#14532d", // Dark green text
                backgroundColor: "#d1fae5", // Light greenish background
              },
              iconTheme: {
                primary: "#22c55e", // Bright green icon
                secondary: "#ffffff", // White inner icon
              },
            },
            error: {
                style: {
                    border: '1px solid #f87171', // Light red border
                    padding: '16px',
                    color: '#b91c1c', // Darker red text
                    backgroundColor: '#fef2f2', // Light reddish background
                  },
                  iconTheme: {
                    primary: '#b91c1c', // Dark red icon color
                    secondary: '#fff', // White inner icon
                  },
              },
          }}
           position="top-right" reverseOrder={false} />
        <main>{children}</main>
      </body>
    </html>
  );
}
