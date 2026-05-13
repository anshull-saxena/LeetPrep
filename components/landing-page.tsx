'use client'

import React, { useEffect, useState, useRef } from 'react'
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
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

gsap.registerPlugin(ScrollTrigger)

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

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
    const [scrollProgress, setScrollProgress] = useState(0)
    const [currentSection, setCurrentSection] = useState(0)
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 })
    const totalSections = 2

    const threeRefs = useRef<ThreeRefs>({
        scene: null,
        camera: null,
        renderer: null,
        composer: null,
        stars: [],
        nebula: null,
        mountains: [],
        animationId: null
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    // Three.js Setup
    useEffect(() => {
        const { current: refs } = threeRefs;
        if (!canvasRef.current) return;

        const initThree = () => {
            refs.scene = new THREE.Scene();
            refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

            refs.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                2000
            );
            refs.camera.position.z = 300;
            refs.camera.position.y = 30;

            refs.renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current!,
                antialias: true,
                alpha: true
            });
            refs.renderer.setSize(window.innerWidth, window.innerHeight);
            refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            refs.renderer.toneMappingExposure = 0.5;

            refs.composer = new EffectComposer(refs.renderer);
            const renderPass = new RenderPass(refs.scene, refs.camera);
            refs.composer.addPass(renderPass);

            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.8,
                0.4,
                0.85
            );
            refs.composer.addPass(bloomPass);

            createStarField();
            createNebula();
            createMountains();
            createAtmosphere();
            createGrid();
            
            animate();
        };

        const createGrid = () => {
            const size = 2000;
            const divisions = 50;
            const gridHelper = new THREE.GridHelper(size, divisions, 0x6366f1, 0x1e1e1e);
            gridHelper.position.y = -150;
            gridHelper.position.z = -500;
            gridHelper.rotation.x = Math.PI * 0.05;
            
            gridHelper.material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0x6366f1) }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPosition;
                    uniform vec3 color;
                    void main() {
                        float dist = length(vPosition.z) / 1000.0;
                        float opacity = (1.0 - dist) * 0.15;
                        gl_FragColor = vec4(color, opacity);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            refs.scene?.add(gridHelper);
        };

        const createStarField = () => {
            const starCount = 5000;
            for (let i = 0; i < 3; i++) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(starCount * 3);
                const colors = new Float32Array(starCount * 3);
                const sizes = new Float32Array(starCount);

                for (let j = 0; j < starCount; j++) {
                    const radius = 200 + Math.random() * 800;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);
                    positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[j * 3 + 2] = radius * Math.cos(phi);

                    const color = new THREE.Color();
                    const colorChoice = Math.random();
                    if (colorChoice < 0.7) color.setHSL(0.6, 0, 0.9); // Pure White
                    else if (colorChoice < 0.9) color.setHSL(0.77, 0.8, 0.8); // Technical Indigo
                    else color.setHSL(0.45, 0.8, 0.8); // Technical Emerald
                    
                    colors[j * 3] = color.r;
                    colors[j * 3 + 1] = color.g;
                    colors[j * 3 + 2] = color.b;
                    sizes[j] = Math.random() * 1.5 + 0.5;
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

                const material = new THREE.ShaderMaterial({
                    uniforms: { time: { value: 0 }, depth: { value: i } },
                    vertexShader: `
                        attribute float size;
                        attribute vec3 color;
                        varying vec3 vColor;
                        uniform float time;
                        uniform float depth;
                        void main() {
                            vColor = color;
                            vec3 pos = position;
                            float angle = time * 0.05 * (1.0 - depth * 0.3);
                            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                            pos.xy = rot * pos.xy;
                            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                            gl_PointSize = size * (300.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        varying vec3 vColor;
                        void main() {
                            float dist = length(gl_PointCoord - vec2(0.5));
                            if (dist > 0.5) discard;
                            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
                            gl_FragColor = vec4(vColor, opacity);
                        }
                    `,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const stars = new THREE.Points(geometry, material);
                refs.scene?.add(stars);
                refs.stars.push(stars);
            }
        };

        const createNebula = () => {
            const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: new THREE.Color(0x6366f1) }, // Indigo 500
                    color2: { value: new THREE.Color(0x10b981) }, // Emerald 500
                    opacity: { value: 0.15 } // More subtle
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    uniform float time;
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        float elevation = sin(pos.x * 0.005 + time * 0.2) * cos(pos.y * 0.005 + time * 0.2) * 40.0;
                        pos.z += elevation;
                        vElevation = elevation;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float opacity;
                    uniform float time;
                    varying vec2 vUv;
                    varying float vElevation;
                    void main() {
                        float mixFactor = sin(vUv.x * 5.0 + time * 0.1) * cos(vUv.y * 5.0 + time * 0.1);
                        vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
                        float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
                        alpha *= 0.5 + vElevation * 0.01;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            const nebula = new THREE.Mesh(geometry, material);
            nebula.position.z = -1200;
            refs.scene?.add(nebula);
            refs.nebula = nebula;
        };

        const createMountains = () => {
            const layers = [
                { distance: -50, height: 40, color: 0x0a0a0a, opacity: 1, rimColor: 0x6366f1 },
                { distance: -120, height: 70, color: 0x080808, opacity: 0.8, rimColor: 0x4f46e5 },
                { distance: -200, height: 100, color: 0x050505, opacity: 0.6, rimColor: 0x4338ca },
                { distance: -300, height: 140, color: 0x020202, opacity: 0.4, rimColor: 0x3730a3 }
            ];

            const locations: number[] = [];
            layers.forEach((layer, i) => {
                const points = [];
                const segments = 100; // Smoother
                for (let j = 0; j <= segments; j++) {
                    const x = (j / segments - 0.5) * 2000;
                    // More jagged/technical terrain
                    const y = Math.sin(j * 0.15) * layer.height + 
                             Math.sin(j * 0.08) * layer.height * 0.4 + 
                             Math.sin(j * 0.3) * layer.height * 0.2 - 120;
                    points.push(new THREE.Vector2(x, y));
                }
                points.push(new THREE.Vector2(10000, -500), new THREE.Vector2(-10000, -500));
                const shape = new THREE.Shape(points);
                const geometry = new THREE.ShapeGeometry(shape);
                
                const material = new THREE.MeshBasicMaterial({ 
                    color: layer.color, 
                    transparent: true, 
                    opacity: layer.opacity,
                    side: THREE.DoubleSide 
                });
                
                const mountain = new THREE.Mesh(geometry, material);
                mountain.position.z = layer.distance;
                mountain.position.y = layer.distance;
                mountain.userData = { baseZ: layer.distance };
                refs.scene?.add(mountain);
                refs.mountains.push(mountain);
                locations[i] = layer.distance;
            });
            refs.locations = locations;
        };

        const createAtmosphere = () => {
            const geometry = new THREE.SphereGeometry(800, 32, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: { 
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x6366f1) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vNormal;
                    uniform float time;
                    uniform vec3 color;
                    void main() {
                        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                        vec3 glow = color * intensity;
                        float pulse = sin(time * 0.5) * 0.05 + 0.95;
                        gl_FragColor = vec4(glow * pulse, intensity * 0.15);
                    }
                `,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });
            const atmosphere = new THREE.Mesh(geometry, material);
            refs.scene?.add(atmosphere);
        };

        const animate = () => {
            refs.animationId = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;
            refs.stars.forEach(s => { if (s.material instanceof THREE.ShaderMaterial) s.material.uniforms.time.value = time; });
            if (refs.nebula?.material instanceof THREE.ShaderMaterial) refs.nebula.material.uniforms.time.value = time * 0.5;

            if (refs.camera && refs.targetCameraX !== undefined) {
                const smoothingFactor = 0.05;
                smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
                smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
                smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
                refs.camera.position.set(
                    smoothCameraPos.current.x + Math.sin(time * 0.1) * 2,
                    smoothCameraPos.current.y + Math.cos(time * 0.15) * 1,
                    smoothCameraPos.current.z
                );
                refs.camera.lookAt(0, 10, -600);
            }

            refs.mountains.forEach((m, i) => {
                const factor = 1 + i * 0.5;
                m.position.x = Math.sin(time * 0.1) * 2 * factor;
                m.position.y = 50 + (Math.cos(time * 0.15) * 1 * factor);
            });

            if (refs.composer) refs.composer.render();
        };

        initThree();

        const handleResize = () => {
            if (refs.camera && refs.renderer && refs.composer) {
                refs.camera.aspect = window.innerWidth / window.innerHeight;
                refs.camera.updateProjectionMatrix();
                refs.renderer.setSize(window.innerWidth, window.innerHeight);
                refs.composer.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (refs.animationId) cancelAnimationFrame(refs.animationId);
            window.removeEventListener('resize', handleResize);
            refs.stars.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose(); });
            refs.mountains.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
            if (refs.nebula) { refs.nebula.geometry.dispose(); (refs.nebula.material as THREE.Material).dispose(); }
            if (refs.renderer) refs.renderer.dispose();
        };
    }, []);

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;
            const progress = Math.min(scrollY / maxScroll, 1);
            
            setScrollProgress(progress);
            const newSection = Math.floor(progress * (totalSections + 1));
            setCurrentSection(Math.min(newSection, totalSections));

            const { current: refs } = threeRefs;
            const totalProgress = progress * totalSections;
            const sectionProgress = totalProgress % 1;
            
            const cameraPositions = [
                { x: 0, y: 30, z: 300 },
                { x: 0, y: 40, z: -50 },
                { x: 0, y: 50, z: -700 }
            ];
            
            const clampedSection = Math.min(Math.floor(totalProgress), cameraPositions.length - 2);
            const currentPos = cameraPositions[clampedSection];
            const nextPos = cameraPositions[clampedSection + 1];
            
            refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
            refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
            refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

            refs.mountains.forEach((m, i) => {
                const speed = 1 + i * 0.9;
                const targetZ = m.userData.baseZ + scrollY * speed * 0.5;
                if (progress > 0.7) m.position.z = 600000;
                else if (refs.locations) m.position.z = refs.locations[i];
            });
            if (refs.nebula && refs.mountains[3]) refs.nebula.position.z = refs.mountains[3].position.z;
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [totalSections]);

    return (
        <div className="min-h-screen flex flex-col bg-black overflow-x-hidden smooth-scroll relative selection:bg-primary selection:text-primary-foreground">
            {/* 3D Background */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />

            {/* Nav */}
            <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50 gpu-accelerate">
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

            {/* Scroll Sections Wrapper */}
            <div className="relative z-10">
                {/* Hero Section - HORIZON Phase */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative py-20">
                    <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                Company-Wise Interview Prep
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter max-w-4xl leading-[0.9]">
                            <span className="gradient-text">Master the</span>
                            <br />
                            <span className="gradient-text">Coding Interview.</span>
                        </h1>

                        <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed font-medium mx-auto">
                            Real-time LeetCode patterns from <span className="text-foreground font-bold">690+ top companies</span>.
                            Track your progress, sync across devices, and land your dream offer.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
                        </div>

                        <div className="mt-16 md:mt-20 flex flex-wrap justify-center gap-12 md:gap-20">
                            {[
                                { target: 3200, suffix: '+', label: 'Interview Questions' },
                                { target: 690, suffix: '+', label: 'Companies Tracked' },
                                { target: 2026, suffix: '', label: 'Latest Data' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter gradient-text">
                                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section - COSMOS Phase */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
                    <div className="max-w-6xl mx-auto w-full">
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
                            <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden bg-white/5 backdrop-blur-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-3">Company-Wise Questions</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Questions tagged by company with frequency data spanning 30 days to all-time. Know exactly what Amazon, Google, Meta, and others ask.
                                    </p>
                                </div>
                            </div>

                            <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden bg-white/5 backdrop-blur-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <BarChart3 className="h-6 w-6 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-3">Progress Tracking</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Mark questions as completed, track your progress per company, filter by difficulty and status. Visual stats with charts.
                                    </p>
                                </div>
                            </div>

                            <div className="group glass-card-hover rounded-3xl p-8 relative overflow-hidden bg-white/5 backdrop-blur-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

                {/* About Section - INFINITY Phase */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="text-center mb-12">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                <Sparkles className="h-3 w-3 text-primary" />
                                About the Creator
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text">
                                Meet the Developer
                            </h2>
                        </div>

                        <div className="glass-card-hover rounded-3xl p-8 md:p-12 relative overflow-hidden bg-white/5 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                            <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                                <div className="shrink-0">
                                    <div className="relative group">
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                                        <img
                                            src="/image.png"
                                            alt="Anshul Saxena"
                                            className="relative h-32 w-32 md:h-40 md:w-40 rounded-3xl border-2 border-white/10 object-cover shadow-2xl transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Anshul Saxena</h3>
                                    <p className="text-primary font-bold mb-4 text-sm tracking-widest uppercase">Software Engineer & Problem Solver</p>
                                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base font-medium">
                                        Passionate about building tools that help engineers succeed. 
                                        LeetPrep provides real-time data from top tech companies to help you learn smarter, not harder.
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <a href="https://github.com/anshull-saxena" target="_blank" className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 text-sm font-semibold transition-all">GitHub</a>
                                        <a href="https://linkedin.com/in/anshulsaxena0" target="_blank" className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 text-sm font-semibold transition-all">LinkedIn</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-white/5 text-center flex flex-col items-center gap-4 bg-black/80 backdrop-blur-md">
                <LogoText className="mb-1" />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    © 2026 LeetPrep. Built for engineers, by engineers.
                </p>
                <div className="mt-4">
                    <Button
                        onClick={signInWithGoogle}
                        className="h-12 px-6 rounded-2xl text-sm font-bold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                    >
                        Start Preparing Now
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </footer>

            {/* Scroll Progress Fixed */}
            <div className="fixed bottom-12 left-12 right-12 z-50 flex items-center gap-8 pointer-events-none opacity-50">
                <div className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase">PHASE</div>
                <div className="flex-1 h-px bg-white/10 overflow-hidden">
                    <div 
                        className="h-full bg-white transition-all duration-300 ease-out" 
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
                <div className="text-[10px] font-bold text-white/50 tabular-nums uppercase tracking-widest">
                    {currentSection === 0 ? 'Horizon' : currentSection === 1 ? 'Cosmos' : 'Infinity'}
                </div>
            </div>
        </div>
    )
}
