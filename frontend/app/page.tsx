import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { ArrowRight, Star, Users, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Founders Matched", value: "50,000+", icon: Users },
  { label: "Startups Launched", value: "3,200+", icon: Zap },
  { label: "Market Size", value: "$1.21B", icon: TrendingUp },
  { label: "Match Success Rate", value: "94%", icon: Star },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO @ Luminary AI",
    avatar: "SC",
    avatarColor: "from-violet-500 to-purple-600",
    quote:
      "FounderConnect's algorithm matched me with my co-founder Marcus in under a week. We had complementary skills — I'm technical, he's business — and we've now raised a $2M seed round.",
    matchScore: 96,
  },
  {
    name: "Marcus Thompson",
    role: "CEO @ Luminary AI",
    avatar: "MT",
    avatarColor: "from-indigo-500 to-blue-600",
    quote:
      "The platform understood that I needed a technical co-founder with ML expertise and startup experience. The match quality was far beyond anything I'd found on LinkedIn or cold outreach.",
    matchScore: 96,
  },
  {
    name: "Priya Patel",
    role: "Co-founder @ GreenLoop",
    avatar: "PP",
    avatarColor: "from-emerald-500 to-teal-600",
    quote:
      "I was skeptical about algorithmic matching, but the compatibility scoring is genuinely insightful. My co-founder and I share the same vision for sustainable tech and have opposite skill sets.",
    matchScore: 91,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Build Your Founder Profile",
    description:
      "Share your skills, industry expertise, startup ideas, and what you're looking for in a co-founder. The more detail you provide, the better your matches.",
    color: "from-violet-500 to-purple-600",
  },
  {
    step: "02",
    title: "Get Compatibility Scored",
    description:
      "Our algorithm analyzes 40+ data points including skill complementarity, values alignment, work style, commitment level, and industry focus to generate a match score.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    step: "03",
    title: "Connect & Collaborate",
    description:
      "Message your top matches through our real-time platform. Schedule calls, share ideas, and evaluate fit before making a commitment.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    step: "04",
    title: "Build Together",
    description:
      "Once you've found your co-founder, FounderConnect keeps your match history and helps you stay connected with your founder network.",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <Icon className="h-8 w-8 text-white/70" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-brand-200 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-4">
              <Zap className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                How It Works
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From idea to co-founder in{" "}
              <span className="text-gradient">4 steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proprietary matching algorithm has helped thousands of
              founders find their perfect partner. Here&apos;s how it works.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover h-full">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-lg mb-4`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.step !== "04" && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-4">
              <Star className="h-4 w-4 text-brand-600 fill-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Success Stories
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Founders who found their{" "}
              <span className="text-gradient">perfect match</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real co-founder pairs who connected on FounderConnect and went on
              to build successful companies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-gray-400 mb-0.5">
                      Match Score
                    </div>
                    <div className="text-lg font-bold text-brand-600">
                      {t.matchScore}%
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-gray-600">
              No credit card required to get your first matches.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Explore matches and test compatibility",
                features: [
                  "Up to 5 match views per month",
                  "Basic compatibility score",
                  "Public profile creation",
                  "3 messages per match",
                ],
                cta: "Get Started Free",
                highlight: false,
              },
              {
                name: "Founder",
                price: "$29",
                period: "per month",
                description: "For serious founders actively searching",
                features: [
                  "Unlimited match views",
                  "Full 40-point compatibility breakdown",
                  "Unlimited messaging",
                  "Priority match placement",
                  "Video call scheduling",
                  "Match history & analytics",
                ],
                cta: "Start 14-Day Trial",
                highlight: true,
              },
              {
                name: "Team",
                price: "$79",
                period: "per month",
                description: "For accelerators and venture studios",
                features: [
                  "Everything in Founder",
                  "Up to 5 team members",
                  "Bulk match management",
                  "API access",
                  "Custom scoring weights",
                  "Priority support",
                ],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-brand-600 to-purple-700 text-white shadow-2xl scale-105"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm ${plan.highlight ? "text-brand-200" : "text-gray-500"}`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span
                      className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-brand-200" : "text-gray-500"}`}
                    >
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-emerald-300" : "text-brand-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          plan.highlight ? "text-brand-100" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-900 via-brand-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Your co-founder is out there.
            <br />
            <span className="text-brand-300">Let&apos;s find them.</span>
          </h2>
          <p className="text-xl text-brand-200 mb-10 max-w-2xl mx-auto">
            Join 50,000+ founders who&apos;ve used FounderConnect to discover
            their perfect partner. Create your profile in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-lg text-lg"
            >
              Create Your Profile Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-400 text-brand-100 font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-brand-400 text-sm mt-6">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FC</span>
                </div>
                <span className="text-white font-semibold text-lg">
                  FounderConnect
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                The smartest way to find your startup co-founder. Powered by
                proprietary compatibility science.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} FounderConnect. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
