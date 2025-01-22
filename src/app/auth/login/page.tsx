'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Check if username is empty
    if (!email) {
      newErrors.email = 'Email is required';
    } 

    // Check if password is empty
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setApiError('')  
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setApiError(error.message);
      } else {
        router.push('/dashboard');
      }
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     router.push('/dashboard');
  //   }
  // };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white rounded-lg shadow-lg flex max-w-4xl w-full">
      {/* Left Side: Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={'/assets/login.jpg'}
          alt="Login Image"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        
          {/* Global Error Message */}
          {apiError && (
            <p className="text-red-500 text-sm mb-4">{apiError}</p>
          )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>


          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-custom-green text-white p-3 rounded hover:bg-green-700"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
   </div>
  );
}
