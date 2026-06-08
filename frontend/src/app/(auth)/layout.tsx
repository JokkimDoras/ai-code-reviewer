'use client';
import { Terminal, FileCode, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full flex bg-[#000000] font-sans antialiased selection:bg-white/10">
      
      {/* LEFT PANEL: Authentic Product Dashboard Preview with Syntax Highlighting */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] p-12 flex-col justify-between relative bg-gradient-to-b from-[#0A0A0A] to-[#000000] border-r border-white/[0.06] overflow-hidden">
        
        {/* Minimalist branding header */}
        <div className="flex items-center gap-2.5 relative z-10 select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.04] border border-white/10 text-white">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white font-medium tracking-tight text-sm">CodeReview</span>
            <span className="text-neutral-500 font-light text-sm ml-0.5">.ai</span>
          </div>
        </div>

        {/* Product UI Mockup */}
        <div className="w-full max-w-[540px] mx-auto my-auto relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-white tracking-tight">Automate code quality checks natively.</h2>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Connect your local or cloud LLM engine to scan repositories for security hazards, leaks, and technical debt.
            </p>
          </div>

          {/* IDE Window Interface */}
          <div className="bg-[#0F1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-xs text-neutral-300">
            {/* Mock IDE Tab Bar */}
            <div className="bg-[#090A0C] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-[#E5C07B]" />
                <span className="text-neutral-400 text-[11px] font-medium">auth.service.ts</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              </div>
            </div>

            {/* Mock Code Block Container with Real Code Colors */}
            <div className="p-4 space-y-1.5 bg-[#0F1115] leading-normal font-normal">
              <div>
                <span className="text-[#C678DD]">async</span> <span className="text-[#61AFEF]">verifySession</span>(token: <span className="text-[#E5C07B]">string</span>) &#123;
              </div>
              <div className="pl-4 text-[#5C6370] italic">// TODO: Implement stronger asymmetric signature verification</div>
              <div className="pl-4 bg-red-500/10 border-l-2 border-red-500 py-0.5 -mx-4 px-4 block">
                <span className="text-[#C678DD]">const</span> <span className="text-[#E06C75]">decoded</span> = jwt.<span className="text-[#61AFEF]">decode</span>(token);
              </div>
              <div className="pl-4">
                <span className="text-[#C678DD]">return</span> <span className="text-[#E06C75]">decoded</span>;
              </div>
              <div>&#125;</div>
            </div>

            {/* High fidelity review response card */}
            <div className="m-3 p-4 bg-[#14171C] border border-white/10 rounded-lg space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E06C75] font-sans font-medium text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Security Vulnerability Detected</span>
                </div>
                <span className="bg-red-500/10 text-red-400 text-[9px] font-sans font-medium px-1.5 py-0.5 rounded tracking-wider uppercase border border-red-500/20">High</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Using unverified payload token decoding bypasses cryptographic signature validation. Attackers can forge identities.
              </p>
              <div className="pt-2 mt-1 border-t border-white/[0.06] flex items-center justify-between font-sans text-[11px]">
                <span className="text-neutral-500">Recommended Fix: Use <code className="font-mono text-[#98C379]">jwt.verify()</code></span>
                <span className="text-white font-medium flex items-center gap-0.5 cursor-pointer hover:underline">
                  Apply fix <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stark Footer Status */}
        <div className="flex items-center gap-5 text-xs text-neutral-500 select-none">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Local AI Model Compatible</span>
          </div>
          <span>•</span>
          <span>AES-256 Workspace Protection</span>
        </div>
      </div>

      {/* RIGHT PANEL: Houses the centered Device Frame with bridging intermediate background color */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-center px-4 py-6 bg-[#050505] overflow-y-auto min-h-screen">
        
        {/* Mobile-only subtle branding indicator */}
        <div className="flex lg:hidden items-center gap-2 mb-4 select-none opacity-60">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.04] border border-white/10 text-white">
            <Terminal className="w-3 h-3" />
          </div>
          <span className="text-white font-medium text-[11px]">CodeReview.ai</span>
        </div>

        {/* SMARTPHONE DEVICE FRAMING - Built to securely contain scrollable forms */}
        <div className="relative w-full max-w-[355px] h-[720px] bg-[#000000] border-[10px] border-[#121212] rounded-[44px] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between ring-1 ring-white/[0.08]">
          
          {/* Phone Ear Speaker / Notch Simulation */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-[#121212] rounded-full z-50 flex items-center justify-center select-none pointer-events-none">
            <div className="w-10 h-0.5 bg-[#222] rounded-full" />
          </div>

          {/* INNER VIEWPORT LAYER: Form handles internal structural scrolling perfectly if values expand */}
          <div className="flex-1 flex flex-col justify-center px-5 pt-12 pb-6 overflow-y-auto scrollbar-none">
            <div className="w-full space-y-6 my-auto">
              {children}
            </div>
          </div>

          {/* Bottom Virtual Home Slide Indicator */}
          <div className="w-full pb-2.5 flex justify-center bg-black pt-1 select-none pointer-events-none">
            <div className="w-24 h-1 bg-neutral-800 rounded-full" />
          </div>

        </div>
      </div>

    </main>
  );
}