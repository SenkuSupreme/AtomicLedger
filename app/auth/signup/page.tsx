
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (res.ok) {
        router.push('/auth/signin');
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to sign up');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 relative z-10">
            <Link href="/" className="absolute top-8 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={16} />
                <span className="text-sm">Back</span>
            </Link>

            <div className="mb-10 text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp size={24} className="text-black" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Join ApexLedger</h1>
                <p className="text-gray-400">Start treating your trading like a business.</p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                            placeholder="trader@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-white hover:underline underline-offset-4">
                    Sign in
                </Link>
            </p>
        </div>
    </div>
  );
}
