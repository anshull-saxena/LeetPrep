'use client'

export function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 grid-dots opacity-[0.03]" />

      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/8 rounded-full blur-[120px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />

      {/* Scan line effect */}
      <div className="absolute inset-0 scan-line" />
    </div>
  )
}
