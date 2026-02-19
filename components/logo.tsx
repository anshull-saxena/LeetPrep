import React from 'react'

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 neon-glow-sm transition-all duration-300 hover:scale-105 group`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3/5 w-3/5 text-primary-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
      >
        <path 
          d="M7 4V20M7 20H13M7 12H11" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:stroke-[3px] transition-all"
        />
        <path 
          d="M14 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H14V4Z" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:stroke-[3px] transition-all"
        />
        <path 
          d="M14 12V20" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:stroke-[3px] transition-all"
        />
      </svg>
    </div>
  )
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo />
      <div>
        <span className="font-black text-xl tracking-tight gradient-text">LeetPrep</span>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">Version 2026.1</p>
        </div>
      </div>
    </div>
  )
}
