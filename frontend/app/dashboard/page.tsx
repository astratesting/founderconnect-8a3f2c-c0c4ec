"use client";

import { useState } from "react";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  ArrowRight,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const mockMatches = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Full-Stack Engineer",
    location: "San Francisco, CA",
    avatar: "AR",
    avatarColor: "from-violet-500 to-purple-600",
    matchScore: 97,
    skills: ["React", "Node.js", "AWS", "TypeScript"],
    lookingFor: "Business / GTM Co-founder",
    industry: "B2B SaaS",
    idea: "AI-powered developer tooling for legacy code modernization",
    isNew: true,
    mutualConnections: 3,
  },
  {
    id: "2",
    name: "Mei Zhang",
    role: "Product Manager @ Meta (ex-Stripe)",
    location: "New York, NY",
    avatar: "MZ",
    avatarColor: "from-indigo-500 to-blue-600",
    matchScore: 94,
    skills: ["Product Strategy", "Growth", "Data Analysis", "B2B"],
    lookingFor: "Technical Co-founder",
    industry: "Fintech",
    idea: "Embedded finance infrastructure for SMBs",
    isNew: true,
    mutualConnections: 1,
  },
  {
    id: "3",
    name: "Jordan Williams",
    role: "ML Engineer @ OpenAI",
    location: "Remote",
    avatar: "JW",
    avatarColor: "from-emerald-500 to-teal-600",
    matchScore: 91,
    skills: ["Python", "LLMs", "MLOps", "Research"],
    lookingFor: "Business / Design Co-founder",
    industry: "AI/ML",
    idea: "Autonomous AI agents for enterprise workflows",
    isNew: false,
    mutualConnections: 5,
  },
  {
    id: "4",
    name: "Isabelle Fontaine",
    role: "Growth Lead @ Figma",
    location: "Austin, TX",
    avatar: "IF",
    avatarColor: "from-rose-500 to-pink-600",
    matchScore: 88,
    skills: ["GTM", "Partnerships", "Marketing", "Community"],
    lookingFor: "Technical Co-founder",
    industry: "Design Tools",
    idea: "Collaborative design platform for non-designers",
    isNew: false,
    mutualConnections: 2,
  },
];

const stats = [
  {
    label: "Active Matches",
    value: "24",
    change: "+4 this week",
    positive: true,
    icon: Users,
    color: "text-brand-600 bg-brand-50",
  },
  {
    label: "Messages",
    value: "7",
    change: "3 unread",
    positive: true,
    icon: MessageSquare,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Profile Views",
    value: "142",
    change: "+22% this week",
    positive: true,
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Match Score Avg",
    value: "89%",
    change: "Top 12% of users",
    positive: true,
    icon: Star,
    color: "text-amber-600 bg-amber-50",
  },
];

const recentActivity = [
  {
    type: "match",
    message: 'New high-compatibility match: Alex Rivera (97%)',
    time: "2 hours ago",
    icon: Zap,
    color: "text-brand-600 bg-brand-50",
  },
  {
    type: "message",
    message: "Mei Zhang replied to your message",
    time: "5 hours ago",
    icon: MessageSquare,
    color: "text-blue-600 bg-blue-50",
  },
  {
    type: "view",
    message: "Jordan Williams viewed your profile",
    time: "Yesterday",
    icon: Target,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    type: "match",
    message: "Isabelle Fontaine matched with you",
    time: "2 days ago",
    icon: CheckCircle2,
    color: "text-purple-600 bg-purple-50",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "new" | "top">("all");

  const filteredMatches = mockMatches.filter((m) => {
    if (activeTab === "new") return m.isNew;
    if (activeTab === "top") return m.matchScore >= 93;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              You have{" "}
              <span className="font-semibold text-brand-600">4 new matches</span>{" "}
              waiting for you.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Founder Plan Active
            </div>
            <Link
              href="/dashboard/profile"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              Complete profile
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Profile completion bar */}
        <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profile strength
            </span>
            <span className="text-sm font-bold text-brand-600">72%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: "72%" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Add your startup idea and LinkedIn to unlock 40% more matches.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div
                className={`text-xs mt-1 font-medium ${stat.positive ? "text-emerald-600" : "text-red-500"}`}
              >
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Matches panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Matches
            </h2>
            <Link
              href="/dashboard/matches"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["all", "new", "top"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "all" ? "All Matches" : tab === "new" ? "New" : "Top Picks"}
              </button>
            ))}
          </div>

          {/* Match cards */}
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${match.avatarColor} flex items-center justify-center text-white font-bold`}
                    >
                      {match.avatar}
                    </div>
                    {match.isNew && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                          {match.name}
                        </h3>
                        <p className="text-sm text-gray-500">{match.role}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-brand-600">
                          {match.matchScore}%
                        </div>
                        <div className="text-xs text-gray-400">match</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-1 italic">
                      &ldquo;{match.idea}&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {match.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                        {match.skills.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{match.skills.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/messages?with=${match.id}`}
                          className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Message
                        </Link>
                        <Link
                          href={`/dashboard/matches/${match.id}`}
                          className="text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`p-4 flex items-start gap-3 ${
                    i !== recentActivity.length - 1
                      ? "border-b border-gray-50"
                      : ""
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-tight">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick match prompt */}
          <div className="mt-4 bg-gradient-to-br from-brand-600 to-purple-700 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-brand-200" />
              <h3 className="font-semibold">Improve Your Matches</h3>
            </div>
            <p className="text-sm text-brand-200 mb-4">
              Adding more detail to your profile unlocks higher-quality co-founder matches.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 bg-white text-brand-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Update Profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
