
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent enumeration
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden items-center justify-center">
       <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

      <div className="w-full max-w-md px-6 relative z-10">
        <Link href="/auth/signin" className="absolute -top-16 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Login</span>
        </Link>
        
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <KeyRound size={24} className="text-white" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            
            {status === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
                    <p className="font-bold mb-2">Check your email</p>
                    <p className="text-sm">If an account exists for {email}, we have sent a password reset link.</p>
                </div>
            ) : (
                <>
                <p className="text-gray-400 mb-8">Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                        placeholder="trader@example.com"
                        required
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
