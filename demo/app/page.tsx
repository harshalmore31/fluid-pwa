'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Users,
  Trophy,
  Network,
  Calendar,
  Sparkles,
  MessageSquare,
  Target,
  Award,
  GitBranch
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1FAEE] via-[#A8DADC] to-[#457B9D]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#457B9D] rounded-lg flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1D3557]">TeamSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1D3557] mb-6">
            Find Your Dream Team
            <br />
            <span className="text-[#457B9D]">for Every Hackathon</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            VIT's exclusive platform for team formation with skill-based matching,
            performance tracking, and seamless collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Sign in with VIT Email
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1D3557] text-center mb-12">
            Everything You Need to Build Winning Teams
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Skill-based Matching */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Skill-based Matching
              </h3>
              <p className="text-gray-600">
                Find teammates with complementary skills using our intelligent matching algorithm.
                Build balanced teams for maximum success.
              </p>
            </Card>

            {/* Card 2: Performance Tracking */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Performance Tracking
              </h3>
              <p className="text-gray-600">
                Track your hackathon journey with performance scores and badges.
                Showcase your achievements to attract top teammates.
              </p>
            </Card>

            {/* Card 3: Previous Teammate Network */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Teammate Network
              </h3>
              <p className="text-gray-600">
                Stay connected with past teammates. See who you've worked with before
                and reunite for future hackathons.
              </p>
            </Card>

            {/* Card 4: Live Hackathon Feed */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Live Hackathon Feed
              </h3>
              <p className="text-gray-600">
                Never miss a hackathon! Get real-time updates on upcoming events,
                deadlines, and team formation opportunities.
              </p>
            </Card>

            {/* Card 5: Smart Suggestions */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Smart Suggestions
              </h3>
              <p className="text-gray-600">
                AI-powered teammate recommendations based on skills, performance,
                and compatibility. Find the perfect match effortlessly.
              </p>
            </Card>

            {/* Card 6: Team Chat */}
            <Card className="p-6 hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <div className="w-12 h-12 bg-[#457B9D] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                Seamless Team Chat
              </h3>
              <p className="text-gray-600">
                Collaborate in real-time with your team. Plan strategies, share ideas,
                and coordinate seamlessly before and during hackathons.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 bg-white/90 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#457B9D] mb-2">500+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#457B9D] mb-2">50+</div>
                <div className="text-gray-600">Hackathons Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#457B9D] mb-2">200+</div>
                <div className="text-gray-600">Teams Formed</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1D3557] text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#457B9D] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up with your VIT email and set up your profile with skills and interests</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#457B9D] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Browse Hackathons</h3>
              <p className="text-gray-600">Explore upcoming hackathons and mark ones you're interested in</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#457B9D] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Find Teammates</h3>
              <p className="text-gray-600">Use smart matching to find teammates or create your own team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#457B9D] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Collaborate & Win</h3>
              <p className="text-gray-600">Chat with your team, plan your project, and win hackathons together!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center bg-gradient-to-r from-[#457B9D] to-[#1D3557]">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of VIT students finding their perfect hackathon teammates
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="bg-white text-[#457B9D] hover:bg-gray-100 text-lg px-8 py-6">
                Get Started for Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-md py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-2">
            <span className="font-semibold text-[#457B9D]">TeamSync</span> - VIT Hackathon Team Formation Platform
          </p>
          <p className="text-sm">
            Made with ❤️ for VIT Students | © {new Date().getFullYear()} TeamSync
          </p>
        </div>
      </footer>
    </div>
  )
}
