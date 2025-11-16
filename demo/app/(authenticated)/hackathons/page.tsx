'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, Users, Trophy, Filter, Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Hackathon {
  id: string
  name: string
  organizer: string
  description: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'completed'
  min_team_size: number
  max_team_size: number
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadHackathons()
  }, [filter])

  const loadHackathons = async () => {
    try {
      let query = supabase
        .from('hackathons')
        .select('*')
        .order('start_date', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setHackathons(data || [])
    } catch (error) {
      console.error('Error loading hackathons:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHackathons = hackathons.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1D3557]">Find Hackathons</h1>
        <p className="text-gray-600 mt-1">
          Discover and participate in exciting hackathons
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search hackathons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Hackathons Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading hackathons...</p>
        </div>
      ) : filteredHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-40 bg-gradient-to-br from-[#A8DADC] to-[#457B9D] rounded-lg mb-4 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{hackathon.name}</CardTitle>
                  <Badge className={getStatusColor(hackathon.status)}>
                    {hackathon.status}
                  </Badge>
                </div>
                <CardDescription>{hackathon.organizer}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Team Size: {hackathon.min_team_size}-{hackathon.max_team_size} members
                </div>
                <Link href={`/hackathons/${hackathon.id}`}>
                  <Button className="w-full mt-2">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hackathons found</p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm ? 'Try a different search term' : 'Check back soon for new opportunities!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
