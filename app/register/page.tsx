
'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    title: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // simple validation
    const { firstName, lastName, email, password, phone, title } = formData;
    if (!firstName || !lastName || !email || !password || !phone || !title) {
      setError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
          title,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration successful!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-blue-200">Join our IoT platform today</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>
            <h3 className="text-2xl font-semibold text-gray-900">Get Started</h3>
            <p className="text-gray-600 mt-1">Create your account in minutes</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" placeholder="John" disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" placeholder="Doe" disabled={isLoading} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" placeholder="you@example.com" disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-black" placeholder="••••••••" disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" disabled={isLoading}>
                  {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input id="phone" name="phone" type="text" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" placeholder="+911234567890" disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input id="title" name="title" type="text" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black" placeholder="Demo Company" disabled={isLoading} />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-blue-200 text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-white font-medium hover:underline">Sign in</Link>
          </p>
          <p className="mt-2">© 2024 AMSET IoT Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

