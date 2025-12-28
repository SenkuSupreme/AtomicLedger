
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function ResetPassword({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setStatus('error');
        setErrorMsg('Passwords do not match');
        return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => router.push('/auth/signin'), 2000);
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.message);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden items-center justify-center">
       <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock size={24} className="text-white" />
            </div>
            
            <h1 className="text-2xl font-bold mb-6 text-center">Set New Password</h1>
            
            {status === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-center">
                    <p className="font-bold">Password Updated!</p>
                    <p className="text-sm mt-2">Redirecting to login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {status === 'error' && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
