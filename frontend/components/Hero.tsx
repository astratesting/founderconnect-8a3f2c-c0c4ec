"use client";

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Play, Sparkles, Shield, Zap } from "lucide-react";

const badges = [
  { icon: Shield, text: "SOC2 Compliant" },
  { icon: Zap, text: "Real-time Matching" },
  { icon: Sparkles, text: "AI-powered Algorithm" },
];

const floatingCards = [
  {
    name: "Alex Rivera",
    role: "Full-Stack Engineer",
    score: 97,
    avatar: "AR",
    color: "from-violet-500 to-purple-600",
    skills: ["React", "AWS", "TypeScript"],
    top: "12%",
    left: "2%",
    rotate: "-6deg",
  },
  {
    name: "Mei Zhang",
    role: "Product @ Meta",
    score: 94,
    avatar: "MZ",
    color: "from-indigo-500 to-blue-600",
    skills: ["Growth", "B2B", "Strategy"],
    top: "55%",
    right: "2%",
    rotate: "5deg",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-purple-900">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0.75s" }}
        />
      </div>

      {/* Floating match cards (decorative) */}
      {floatingCards.map((card) => (
        <div
          key={card.name}
          className="hidden lg:block absolute glass-dark rounded-2xl p-4 shadow-2xl animate-float z-10 max-w-xs"
          style={{
            top: card.top,
            left: (card as { left?: string }).left,
            right: (card as { right?: string }).right,
            transform: `rotate(${card.rotate})`,
            animationDelay: card.name === "Mei Zhang" ? "1s" : "0s",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-bold text-sm`}
            >
              {card.avatar}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{card.name}</div>
              <div className="text-white/60 text-xs">{card.role}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-brand-300 font-bold text-lg">{card.score}%</div>
              <div className="text-white/40 text-xs">match</div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {card.skills.map((s) => (
              <span
                key={s}
                className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-20 w-full">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-brand-300" />
          <span className="text-sm font-medium text-white/90">
            Proprietary 40-Point Compatibility Algorithm
          </span>
          <span className="text-brand-300">•</span>
          <span className="text-sm text-white/60">50,000+ Founders</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Find your
          <br />
          <span className="text-gradient bg-gradient-to-r from-brand-300 via-purple-300 to-pink-300 [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent]">
            perfect co-founder
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-xl sm:text-2xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
          FounderConnect matches entrepreneurs based on{" "}
          <span className="text-white font-semibold">
            complementary skills
          </span>
          ,{" "}
          <span className="text-white font-semibold">shared vision</span>, and{" "}
          <span className="text-white font-semibold">industry alignment</span>.
          Stop searching. Start building.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <SignUpButton mode="modal">
            <button className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-2xl hover:shadow-white/25 text-lg group">
              Find My Co-founder
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>
          <button className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm text-lg">
            <Play className="h-5 w-5 text-brand-300" />
            Watch Demo
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-white/60"
              >
                <Icon className="h-4 w-4 text-brand-400" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            );
          })}
        </div>

        {/* Social proof avatars */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[
              { initials: "SC", color: "from-violet-500 to-purple-600" },
              { initials: "MT", color: "from-indigo-500 to-blue-600" },
              { initials: "PP", color: "from-emerald-500 to-teal-600" },
              { initials: "JW", color: "from-rose-500 to-pink-600" },
              { initials: "IF", color: "from-amber-500 to-orange-600" },
            ].map((a) => (
              <div
                key={a.initials}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.color} border-2 border-brand-800 flex items-center justify-center text-white text-xs font-bold`}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 text-amber-400 fill-amber-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-white/60 text-sm">
              <span className="text-white font-semibold">4.9/5</span> from
              3,200+ founder pairs
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 80L60 72C120 64 240 48 360 45.3C480 43 600 53 720 58.7C840 64 960 64 1080 58.7C1200 53 1320 43 1380 37.3L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
