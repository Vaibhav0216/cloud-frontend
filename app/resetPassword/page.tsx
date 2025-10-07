import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const sent = (searchParams?.sent as string) === '1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-white/95 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Mail size={28} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-blue-200">Enter your registered email address and we’ll send you a link to reset your password.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all">
          {sent && (
            <div className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm border bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 size={16} />
              <span>Reset link sent! Please check your inbox.</span>
            </div>
          )}

          <form method="GET" action="/resetPassword" className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yourname@example.com"
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition"
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <input type="hidden" name="sent" value="1" />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
              <ArrowLeft size={16} className="mr-1" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-blue-200">© 2025 AMSET IoT Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
