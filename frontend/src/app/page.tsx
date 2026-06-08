import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-4">AI Code Reviewer</h1>
      <p className="text-gray-400 mb-8">Upload your code and get AI-powered reviews</p>
      <div className="flex gap-4">
        <Link href="/auth/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/register">
          <Button>Get Started</Button>
        </Link>
      </div>
    </main>
  );
}