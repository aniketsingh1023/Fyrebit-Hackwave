"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Bell, Server, BarChart3, ArrowRight } from "lucide-react";

// /subscription page — Pricing & Revenue Strategy (₹)
// Theme: Red & White only

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-red-950 text-white">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Affordable <span className="text-red-300">Subscriptions</span>
          </h1>
          <p className="text-red-100/90 max-w-3xl mx-auto">
            Choose a plan priced in <span className="font-bold">INR</span> to fit your growth stage. Start small, grow big.
          </p>
        </motion.div>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <PriceCard name="Starter" price="₹199/mo" cta="Start Trial">
            <ul className="space-y-2 list-disc list-inside text-red-100/90">
              <li>Up to 3 sources • 1 workspace</li>
              <li>50 scraped pages/day</li>
              <li>Basic trend briefs + 20 AI posts/mo</li>
            </ul>
          </PriceCard>
          <PriceCard featured name="Pro" price="₹499/mo" cta="Upgrade">
            <ul className="space-y-2 list-disc list-inside text-red-00/90">
              <li>20 sources • 3 workspaces</li>
              <li>1,000 scraped pages/day + priority queue</li>
              <li>Advanced briefs + 200 AI posts/mo + scheduler</li>
            </ul>
          </PriceCard>
          <PriceCard name="Scale" price="₹1299/mo" cta="Talk to Sales">
            <ul className="space-y-2 list-disc list-inside text-red-100/90">
              <li>Unlimited sources • 10 workspaces</li>
              <li>5,000 scraped pages/day</li>
              <li>Custom templates, SLAs, success manager</li>
            </ul>
          </PriceCard>
        </div>

        {/* Extra Revenue Features */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Card title="Notifications" icon={<Bell className="h-5 w-5" />}>
            <p className="text-red-100/90">
              Premium users get <span className="font-semibold">real-time notifications</span> when trends match their preferences.
            </p>
          </Card>
          <Card title="API Access" icon={<Server className="h-5 w-5" />}>
            <p className="text-red-100/90">
              Provide an <span className="font-semibold">API endpoint</span> so developers and agencies can directly integrate our trend data.
            </p>
          </Card>
          <Card title="Brand Analytics" icon={<BarChart3 className="h-5 w-5" />}>
            <p className="text-red-100/90">
              Build an <span className="font-semibold">admin panel</span> for fashion brands to analyze what’s trending, helping them stay ahead.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-white text-red-900 px-6 py-4 font-semibold shadow hover:shadow-lg transition">
            Get Early Access <ArrowRight className="h-4 w-4" />
          </a>
          <span className="text-red-200 text-sm">Questions? DM us for a pilot slot.</span>
        </div>
      </section>
    </main>
  );
}

function Card({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-red-800/60 bg-red-900/40 p-5 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-red-300">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

function PriceCard({ name, price, cta, children, featured }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl p-6 border shadow-sm hover:shadow-md ${
        featured ? "bg-white text-red-900 border-red-200" : "bg-red-900/40 border-red-800/60"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className={`text-xl font-bold ${featured ? "text-red-900" : "text-white"}`}>{name}</h3>
        <span className={`text-3xl font-extrabold ${featured ? "text-red-700" : "text-red-300"}`}>{price}</span>
      </div>
      <div className={`mt-4 ${featured ? "text-red-800" : "text-red-100/90"}`}>{children}</div>
      <button className={`mt-5 w-full rounded-2xl px-4 py-3 font-semibold transition flex items-center justify-center gap-2 ${
        featured ? "bg-red-900 text-white hover:opacity-90" : "bg-white text-red-900 hover:opacity-90"
      }`}>
        {cta} <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
 