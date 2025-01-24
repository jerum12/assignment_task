'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormErrors } from '@/types';
import { Loader } from 'react-feather';
import toast from 'react-hot-toast';
import Image from 'next/image';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    e.preventDefault();
    
    if (validateForm()) {
   
      setErrors({});
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('User Successfully logged in!');

        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        }
        
        router.push('/dashboard');
      }
    }{
      setLoading(false);
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
      <div className="relative w-full h-full rounded-l-lg">
        <Image
          src="/assets/login.jpg"
          alt="Login Image"
          className="object-cover rounded-l-lg"
          fill
        />
      </div>

      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

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
            disabled={loading}
            className="w-full bg-custom-green text-white p-3 rounded hover:bg-green-700"
          >
           {loading ? (
                    <>
                        <Loader className="animate-spin mr-2" size={20} />
                    </>
                ) : (
                  'Login'
                )}
          </Button>
        </form>
      </div>
    </div>
   </div>
  );
}
