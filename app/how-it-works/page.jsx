"use client"

import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    title: "Step 1 – Sign Up & Join",
    description: "Create your account and join the hackathon platform.",
    icon: (
      <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
      </svg>
    ),
  },
  {
    title: "Step 2 – Explore & Contribute",
    description: "Browse challenges, share your ideas, and contribute.",
    icon: (
      <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v-2H3v2zm4 0h14v-2H7v2zm-4 6h2v-2H3v2zm4 0h14v-2H7v2zM3 7h2V5H3v2zm4 0h14V5H7v2z" />
      </svg>
    ),
  },
  {
    title: "Step 3 – Collaborate & Achieve",
    description: "Work with your team and achieve milestones together.",
    icon: (
      <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.2 0 4-1.8 4-4S14.2 4 12 4 8 5.8 8 8s1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
      </svg>
    ),
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-10">How It Works</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <Card key={idx} className="p-6">
              <div className="mb-3">{step.icon}</div>
              <CardContent>
                <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
