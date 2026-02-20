'use client'

import React, { useEffect, useState } from 'react'
import {
    Code2,
    Building2,
    TrendingUp,
    Cloud,
    ChevronRight,
    Sparkles,
    Zap,
    BarChart3,
    ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { Logo, LogoText } from '@/components/logo'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [target])

    return (
        <span>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export function LandingPage() {
    const { signInWithGoogle } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-background overflow-x-hidden smooth-scroll">
            {/* Nav */}
            <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-sm sticky top-0 z-50 gpu-accelerate">
                <LogoText />
                <Button
                    onClick={signInWithGoogle}
                    className="h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-foreground font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 gap-2 px-5"
                    variant="ghost"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign In
                </Button>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 text-center relative py-20 md:py-32">
                {/* Background orbs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-float pointer-events-none gpu-accelerate" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-float-delayed pointer-events-none gpu-accelerate" />

                {/* Badge */}
                <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        Company-Wise Interview Prep
                    </span>
                </div>

                {/* Main headline */}
                <h1 className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter max-w-4xl leading-[0.9] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <span className="gradient-text">Master the</span>
                    <br />
                    <span className="gradient-text">Coding Interview.</span>
                </h1>

                {/* Sub text */}
                <p className={`mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed font-medium transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    Real-time LeetCode patterns from <span className="text-foreground font-bold">690+ top companies</span>.
                    Track your progress, sync across devices, and land your dream offer.
                </p>

                {/* CTA */}
                <div className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <Button
                        onClick={signInWithGoogle}
                        className="h-14 px-8 rounded-2xl text-base font-bold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] neon-glow-sm"
                        size="lg"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Get Started with Google
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground font-medium">
                        Free forever • No credit card needed
                    </p>
                </div>

                {/* Stats */}
                <div className={`mt-16 md:mt-20 flex flex-wrap justify-center gap-12 md:gap-20 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    {[
                        { target: 3200, suffix: '+', label: 'Interview Questions' },
                        { target: 690, suffix: '+', label: 'Companies Tracked' },
                        { target: 2026, suffix: '', label: 'Latest Data' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl md:text-4xl font-black tracking-tighter gradient-text">
                                {mounted ? <AnimatedCounter target={stat.target} suffix={stat.suffix} /> : '0'}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 md:px-12 py-20 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            <Zap className="h-3 w-3 text-primary" />
                            Why LeetPrep
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text">
                            Everything you need to prepare.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all duration-500" />
                            <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">Company-Wise Questions</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Questions tagged by company with frequency data spanning 30 days to all-time. Know exactly what Amazon, Google, Meta, and 690+ others ask.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] group-hover:bg-accent/10 transition-all duration-500" />
                            <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">Progress Tracking</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Mark questions as completed, track your progress per company, filter by difficulty and status. Visual stats with charts and progress rings.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] group-hover:bg-emerald-500/10 transition-all duration-500" />
                            <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Cloud className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">Cloud Sync</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Sign in with Google and your progress syncs to the cloud instantly. Switch devices seamlessly and never lose your progress.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Logos / Trending */}
            <section className="px-6 md:px-12 py-16 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-8">
                        Questions from top companies
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Amazon', 'Google', 'Meta', 'Apple', 'Microsoft', 'Netflix', 'Uber', 'Airbnb', 'Bloomberg', 'Adobe', 'Oracle', 'Salesforce'].map((name) => (
                            <span
                                key={name}
                                className="px-5 py-2.5 rounded-xl border border-white/5 bg-card/30 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-default"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="px-6 md:px-12 py-20 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 gradient-text">
                        Ready to ace your interviews?
                    </h2>
                    <p className="text-muted-foreground mb-8 font-medium">
                        Join thousands of engineers preparing with real company data.
                    </p>
                    <Button
                        onClick={signInWithGoogle}
                        className="h-13 px-8 rounded-2xl text-base font-bold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] neon-glow-sm"
                        size="lg"
                    >
                        Start Preparing Now
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* About Author Section */}
            <section className="px-6 md:px-12 py-20 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            <Sparkles className="h-3 w-3 text-primary" />
                            About the Creator
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text">
                            Meet the Developer
                        </h2>
                    </div>

                    <div className="glass-card-hover rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background orbs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
                        
                        <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                            {/* Author Image */}
                            <div className="shrink-0">
                                <div className="relative group">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                                    <img
                                        src="/image.png"
                                        alt="Anshul Saxena"
                                        className="relative h-32 w-32 md:h-40 md:w-40 rounded-3xl border-2 border-white/10 object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">
                                    Anshul Saxena
                                </h3>
                                <p className="text-primary font-bold mb-4">
                                    Software Engineer & Problem Solver
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Passionate about building tools that help engineers succeed in their career journey. 
                                    LeetPrep was born from my own interview preparation experience and the need for a 
                                    comprehensive, company-focused approach to coding practice. I believe in learning smarter, 
                                    not harder, and this platform embodies that philosophy by providing real-time data from 
                                    top tech companies.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <a
                                        href="https://github.com/anshull-saxena"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-300"
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/anshulsaxena0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-300"
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        LinkedIn
                                    </a>
                                    <a
                                        href="mailto:f20221041@hyderabad.bits-pilani.ac.in?subject=Hello%20from%20LeetPrep"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 text-sm font-semibold transition-all duration-300"
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                        </svg>
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Stats or highlights */}
                        <div className="relative mt-10 pt-8 border-t border-white/5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <p className="text-2xl font-black gradient-text">3200+</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Problems Curated</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black gradient-text">690+</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Companies Tracked</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black gradient-text">Real-Time</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Data Updates</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black gradient-text">Open Source</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Community Driven</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-12 py-8 border-t border-white/5 text-center flex flex-col items-center gap-4">
                <LogoText className="mb-1" />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    © 2026 LeetPrep. Built for engineers, by engineers.
                </p>
            </footer>
        </div>
    )
}
