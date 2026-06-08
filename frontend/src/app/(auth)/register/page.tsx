'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-white text-2xl sm:text-3xl font-medium tracking-tight">Create an account</h1>
        <p className="text-neutral-400 text-sm">Get started with your codebase analyzer setup.</p>
      </div>

      <div className="space-y-4">
        {error && <div className="p-3 bg-white/[0.02]  border-white/10  text-red-500 text-xs font-medium">{error}</div>}

        <div className="space-y-2">
          <label className="text-neutral-400 text-xs font-medium tracking-wide">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-600"><User className="w-4 h-4" /></span>
            <input
              type="text"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-neutral-800 focus:border-neutral-500 text-white placeholder:text-neutral-700 rounded-xl outline-none text-sm transition-all disabled:opacity-50 font-normal"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-neutral-400 text-xs font-medium tracking-wide">Email address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-600"><Mail className="w-4 h-4" /></span>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-neutral-800 focus:border-neutral-500 text-white placeholder:text-neutral-700 rounded-xl outline-none text-sm transition-all disabled:opacity-50 font-normal"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-neutral-400 text-xs font-medium tracking-wide">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-600"><Lock className="w-4 h-4" /></span>
            <input
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-neutral-800 focus:border-neutral-500 text-white placeholder:text-neutral-700 rounded-xl outline-none text-sm transition-all disabled:opacity-50 font-normal"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleRegister}
        disabled={loading || !name || !email || !password}
        className="w-full py-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-sm transition-all duration-150 shadow-sm disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Creating profile...</span>
          </>
        ) : (
          <span>Register</span>
        )}
      </Button>

      <p className="text-neutral-500 text-sm font-medium text-center pt-2">
        Already have an account? <Link href="/login" className="text-neutral-400 font-semibold hover:text-white transition-colors ml-1">Login</Link>
      </p>
    </>
  );
}