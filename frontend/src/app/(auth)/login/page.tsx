'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      console.log(localStorage.setItem('token', res.data.token))
      console.log(localStorage.setItem('user', JSON.stringify(res.data.user)))
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-white text-2xl sm:text-3xl font-medium tracking-tight">Sign in to account</h1>
        <p className="text-neutral-400 text-sm">Enter your developer access credentials.</p>
      </div>

      <div className="space-y-4">
        {error && <div className="p-3 bg-white/[0.02]  border-white/10  text-red-500 text-xs font-medium">{error}</div>}

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
          <div className="flex items-center justify-between">
            <label className="text-neutral-400 text-xs font-medium tracking-wide">Password</label>
            <Link href="#" className="text-xs text-neutral-400 font-medium hover:text-white transition-colors">Forgot password?</Link>
          </div>
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
        onClick={handleLogin}
        disabled={loading || !email || !password}
        className="w-full py-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-sm transition-all duration-150 shadow-sm disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Verifying access...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </Button>

      <div className="relative flex items-center py-0.5">
        <div className="flex-grow border-t border-neutral-900"></div>
        <span className="flex-shrink mx-4 text-neutral-600 text-[11px] font-medium tracking-wide">or authentication key</span>
        <div className="flex-grow border-t border-neutral-900"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={loading} className="py-3 bg-[#0A0A0A] hover:bg-[#121212] border border-neutral-800 text-neutral-300 hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-xs font-medium disabled:opacity-50">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.061.069-.061 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span>GitHub</span>
        </button>
        <button type="button" disabled={loading} className="py-3 bg-[#0A0A0A] hover:bg-[#121212] border border-neutral-800 text-neutral-300 hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-xs font-medium disabled:opacity-50">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.745 12.27c0-.77-.064-1.54-.191-2.29H12v4.35h6.6c-.284 1.51-1.145 2.78-2.436 3.63v3.02h3.927c2.3-2.12 3.654-5.24 3.654-8.71z" fill="#FFFFFF"/><path d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.927-3.02c-1.09.73-2.49 1.16-4.033 1.16-3.1 0-5.73-2.11-6.67-4.96H1.28v3.11C3.26 22.19 7.39 24 12 24z" fill="#CCCCCC"/><path d="M5.33 14.27c-.24-.73-.38-1.5-.38-2.27s.14-1.54.38-2.27V6.62H1.28c-.81 1.62-1.28 3.44-1.28 5.38s.47 3.76 1.28 5.38l4.05-3.11z" fill="#AAAAAA"/><path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.39 0 3.26 1.81 1.28 4.75l4.05 3.11c.94-2.85 3.57-4.96 6.67-4.96z" fill="#EAEAEA"/></svg>
          <span>Google</span>
        </button>
      </div>

      <p className="text-neutral-500 text-sm font-medium text-center pt-2">
        New to the system? <Link href="/register" className="text-neutral-400 font-semibold hover:text-white transition-colors ml-1">Create an account</Link>
      </p>
    </>
  );
}