import React, { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  GitBranch,
  Shield,
  Activity,
  Globe,
  Zap,
} from "lucide-react";

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const prices = {
    pro: billingCycle === "monthly" ? 29 : 290,
    team: billingCycle === "monthly" ? 99 : 990,
  };

  return (
    <section
      id="pricing"
      className="py-32 dark:bg-black bg-gray-50 relative border-t dark:border-white/5 border-gray-200 overflow-hidden transition-colors duration-300"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-gray-900 tracking-tight">
            Simple, transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">
              pricing
            </span>
          </h2>
          <p className="dark:text-neutral-400 text-gray-600 max-w-xl mx-auto text-lg mb-8">
            Choose the plan that fits your codebase size and team needs.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center p-1 dark:bg-neutral-900/80 bg-white border dark:border-white/10 border-gray-200 rounded-full backdrop-blur-sm shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "dark:bg-white bg-black dark:text-black text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "dark:bg-white bg-black dark:text-black text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {/* Starter Tier */}
          <div className="p-8 rounded-3xl border dark:border-white/5 border-gray-200 dark:bg-neutral-900/20 bg-white flex flex-col dark:hover:bg-neutral-900/40 hover:shadow-xl transition-all duration-300 group">
            <div className="mb-8">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2 flex items-center gap-2">
                <Globe size={16} className="text-neutral-400" />
                Starter
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold dark:text-white text-gray-900">
                  $0
                </span>
                <span className="text-neutral-500">/forever</span>
              </div>
              <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
                For open source projects and individual hobbyists.
              </p>
            </div>
            <div className="h-px w-full bg-gradient-to-r dark:from-white/10 from-black/10 to-transparent mb-8"></div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited Public Repositories",
                "Basic Dependency Maps",
                "Up to 50MB Repo Size",
                "7-day History Retention",
                "Community Support",
              ].map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm dark:text-neutral-300 text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-sm text-neutral-400">
                <X className="w-4 h-4 mt-0.5" />
                <span>Private Repositories</span>
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              Start Free
            </button>
          </div>

          {/* Professional Tier - Highlighted */}
          <div className="p-8 rounded-3xl border border-green-500/50 dark:bg-[#080808] bg-white flex flex-col relative overflow-hidden shadow-2xl md:-mt-4 md:mb-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="mb-8 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold dark:text-white text-gray-900 flex items-center gap-2">
                  <Zap size={16} className="text-green-500" />
                  Professional
                </h3>
                <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold dark:text-white text-gray-900">
                  ${prices.pro}
                </span>
                <span className="text-neutral-500">
                  /{billingCycle === "yearly" ? "year" : "mo"}
                </span>
              </div>
              <p className="text-sm dark:text-neutral-400 text-gray-600 mt-4 leading-relaxed">
                For professional developers managing complex private codebases.
              </p>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-green-500/50 to-transparent mb-8"></div>
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {[
                "15 Private Repositories",
                "Advanced Risk & Complexity Scores",
                "Export to Figma, SVG & JSON",
                "Up to 1GB Repo Size",
                "Priority Rendering Queue",
                "VS Code Extension Access",
              ].map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm dark:text-white text-gray-900"
                >
                  <div className="p-0.5 rounded-full bg-green-500 text-black mt-0.5">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10">
              Get Pro Access
            </button>
          </div>

          {/* Organization Tier */}
          <div className="p-8 rounded-3xl border dark:border-white/5 border-gray-200 dark:bg-neutral-900/20 bg-white flex flex-col dark:hover:bg-neutral-900/40 hover:shadow-xl transition-colors duration-300 group">
            <div className="mb-8">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2 flex items-center gap-2">
                <Shield size={16} className="text-blue-500" />
                Organization
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold dark:text-white text-gray-900">
                  ${prices.team}
                </span>
                <span className="text-neutral-500">
                  /{billingCycle === "yearly" ? "year" : "mo"}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
                For teams requiring enterprise-grade security and integration.
              </p>
            </div>
            <div className="h-px w-full bg-gradient-to-r dark:from-white/10 from-black/10 to-transparent mb-8"></div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited Private Repos",
                "CI/CD Pipeline Integration",
                "Architecture Drift Alerts",
                "SSO & Audit Logs",
                "Team Comments & Annotations",
                "Dedicated Success Manager",
              ].map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm dark:text-neutral-300 text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
