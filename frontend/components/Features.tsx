"use client";

import {
  Brain,
  MessageSquare,
  UserCircle,
  BarChart3,
  Lock,
  Globe,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";

const mainFeatures = [
  {
    icon: Brain,
    title: "40-Point Compatibility Algorithm",
    description:
      "Our proprietary scoring engine evaluates skill complementarity, values alignment, commitment level, work style preferences, and domain expertise to generate a compatibility score uniquely calibrated for startup success.",
    highlight: "Inspired by CoFoundersLab's proprietary matching methodology",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-100",
  },
  {
    icon: MessageSquare,
    title: "Real-time Founder Messaging",
    description:
      "Connect instantly with your top matches through our built-in messaging system. Share ideas, schedule calls, and evaluate co-founder fit — all without leaving FounderConnect.",
    highlight: "Powered by Supabase Realtime",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
  },
  {
    icon: UserCircle,
    title: "Rich Founder Profiles",
    description:
      "Go beyond a resume. Showcase your technical skills, business experience, startup ideas, equity expectations, time commitment, and what you need in a partner.",
    highlight: "Skills · Ideas · Industries · Availability",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
];

const secondaryFeatures = [
  {
    icon: BarChart3,
    title: "Match Analytics Dashboard",
    description:
      "Track your profile performance, match quality trends, and message response rates. Understand what makes you an attractive co-founder.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Lock,
    title: "OAuth Authentication",
    description:
      "Sign in instantly with Google, GitHub, or LinkedIn via Clerk. Your data is encrypted and protected by enterprise-grade security.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Globe,
    title: "Global Founder Network",
    description:
      "Connect with founders across 80+ countries. Filter by location, remote-friendly status, timezone, and industry vertical.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Target,
    title: "Idea-First Matching",
    description:
      "Already have a startup idea? Post it and attract co-founders who resonate with your vision, not just your resume.",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: Zap,
    title: "Instant Match Notifications",
    description:
      "Get notified the moment a high-compatibility founder joins the platform or updates their profile. Never miss a great match.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Sparkles,
    title: "Match History & Insights",
    description:
      "Full transparency on how your compatibility score is calculated. See exactly which skills, values, and goals drove each match.",
    color: "text-purple-600 bg-purple-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-700">
              Platform Features
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to find{" "}
            <span className="text-gradient">the right partner</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            FounderConnect combines data-driven matching with real human
            connection. Built for founders who are serious about finding a
            long-term partner, not just a contact.
          </p>
        </div>

        {/* Main feature cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`relative rounded-2xl border ${feature.borderColor} ${feature.bgColor} p-8 overflow-hidden card-hover`}
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/70 px-3 py-1.5 rounded-full border border-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {feature.highlight}
                </div>

                {/* Decorative gradient orb */}
                <div
                  className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-2xl`}
                />
              </div>
            );
          })}
        </div>

        {/* Secondary features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-md hover:border-gray-100 border border-transparent transition-all duration-200"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${feature.color} mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Compatibility breakdown visual */}
        <div className="mt-16 bg-gradient-to-br from-brand-900 to-purple-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
                <Brain className="h-4 w-4 text-brand-300" />
                <span className="text-sm font-medium text-white/90">
                  How We Score Compatibility
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Science-backed matching for startup success
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Research shows that co-founder misalignment is the #1 cause of
                early startup failure. Our 40-point algorithm was designed to
                surface the dimensions that actually predict long-term
                co-founder success.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Skill Complementarity", value: 30, color: "from-violet-400 to-purple-500" },
                  { label: "Values & Vision Alignment", value: 25, color: "from-indigo-400 to-blue-500" },
                  { label: "Work Style & Commitment", value: 20, color: "from-emerald-400 to-teal-500" },
                  { label: "Industry & Domain Fit", value: 15, color: "from-amber-400 to-orange-500" },
                  { label: "Stage & Equity Alignment", value: 10, color: "from-rose-400 to-pink-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">{item.label}</span>
                      <span className="text-white/60">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.value * 3.33}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample score card */}
            <div className="glass rounded-2xl p-6 max-w-sm mx-auto w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  AR
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Alex Rivera</div>
                  <div className="text-sm text-gray-500">Full-Stack Engineer</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-600">97%</div>
                  <div className="text-xs text-gray-400">match score</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Skill Complementarity", score: 98, color: "bg-violet-500" },
                  { label: "Values & Vision", score: 95, color: "bg-indigo-500" },
                  { label: "Work Style", score: 96, color: "bg-emerald-500" },
                  { label: "Industry Fit", score: 99, color: "bg-amber-500" },
                  { label: "Stage Alignment", score: 97, color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-36 flex-shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
