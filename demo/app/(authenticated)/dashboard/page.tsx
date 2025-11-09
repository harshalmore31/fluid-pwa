'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Calendar,
  Users,
  Trophy,
  Plus,
  Search,
  TrendingUp,
  Star
} from 'lucide-react'

interface Hackathon {
  id: string
  name: string
  organizer: string
  start_date: string
  end_date: string
  status: string
}

interface UserProfile {
  name: string
  branch: string
  year: number
  performance_score: number
  total_hackathons: number
}

export default function DashboardPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('name, branch, year, performance_score, total_hackathons')
        .eq('id', user?.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load upcoming hackathons
      const { data: hackathons } = await supabase
        .from('hackathons')
        .select('id, name, organizer, start_date, end_date, status')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(3)

      if (hackathons) {
        setUpcomingHackathons(hackathons)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 200) return { label: 'Expert', color: 'bg-amber-500' }
    if (score >= 100) return { label: 'Advanced', color: 'bg-purple-500' }
    if (score >= 50) return { label: 'Intermediate', color: 'bg-blue-500' }
    return { label: 'Beginner', color: 'bg-gray-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  const badge = profile ? getPerformanceBadge(profile.performance_score) : null

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1D3557]">
          Welcome back, {profile?.name || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your hackathon journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#457B9D]">
                  {profile?.performance_score.toFixed(0) || 0}
                </div>
                {badge && (
                  <Badge className={`${badge.color} text-white mt-2`}>
                    {badge.label}
                  </Badge>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-[#457B9D] opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hackathons Participated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#457B9D]">
                {profile?.total_hackathons || 0}
              </div>
              <Trophy className="w-8 h-8 text-[#457B9D] opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Teams Formed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#457B9D]">0</div>
              <Users className="w-8 h-8 text-[#457B9D] opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/teams/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-[#457B9D] to-[#1D3557] text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Create a Team</h3>
                    <p className="text-sm text-white/80">Start forming your dream team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/browse">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F1FAEE] rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-[#457B9D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1D3557]">Find Teammates</h3>
                    <p className="text-sm text-gray-600">Browse participants looking for teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Upcoming Hackathons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1D3557]">Upcoming Hackathons</h2>
          <Link href="/hackathons">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {upcomingHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingHackathons.map((hackathon) => (
              <Link key={hackathon.id} href={`/hackathons/${hackathon.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-full h-32 bg-gradient-to-br from-[#A8DADC] to-[#457B9D] rounded-lg mb-4 flex items-center justify-center">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-lg">{hackathon.name}</CardTitle>
                    <CardDescription>{hackathon.organizer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(hackathon.start_date).toLocaleDateString()}
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming hackathons at the moment</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new opportunities!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-500 mt-2">
              Join a hackathon or create a team to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
