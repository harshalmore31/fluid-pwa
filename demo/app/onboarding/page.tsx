'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BRANCHES, YEARS } from '@/lib/constants'
import { GitBranch, User, Code, Link as LinkIcon, FileText } from 'lucide-react'

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python',
  'Node.js', 'Machine Learning', 'Deep Learning', 'TensorFlow',
  'PyTorch', 'Blockchain', 'Solidity', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST API', 'Flutter', 'React Native',
  'UI/UX Design', 'Figma', 'Tailwind CSS', 'Vue.js',
  'Django', 'Flask', 'FastAPI', 'Java', 'C++', 'Go', 'Rust'
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    branch: '',
    year: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: ''
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email!,
          ...formData
        }])

      if (userError) throw userError

      // Add skills
      if (selectedSkills.length > 0) {
        // Get skill IDs
        const { data: skills } = await supabase
          .from('skills')
          .select('id, name')
          .in('name', selectedSkills)

        if (skills) {
          const userSkills = skills.map(skill => ({
            user_id: user.id,
            skill_id: skill.id
          }))

          await supabase.from('user_skills').insert(userSkills)
        }
      }

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Onboarding error:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1FAEE] via-[#A8DADC] to-[#457B9D] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#457B9D] rounded-xl flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1D3557] mb-2">Welcome to TeamSync!</h1>
          <p className="text-gray-700">Let's set up your profile to help you find the perfect teammates</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-[#457B9D] text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-[#457B9D]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Skills</span>
            <span>Social Links</span>
            <span>Bio</span>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><User className="w-5 h-5" /> Basic Information</>}
              {step === 2 && <><Code className="w-5 h-5" /> Your Skills</>}
              {step === 3 && <><LinkIcon className="w-5 h-5" /> Social Links</>}
              {step === 4 && <><FileText className="w-5 h-5" /> About You</>}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'What technologies and skills do you have?'}
              {step === 3 && 'Add your professional links (optional)'}
              {step === 4 && 'Write a short bio to introduce yourself'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roll_no">Roll Number *</Label>
                  <Input
                    id="roll_no"
                    placeholder="21BCE1234"
                    value={formData.roll_no}
                    onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <select
                      id="branch"
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      required
                    >
                      <option value="">Select branch</option>
                      {BRANCHES.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <select
                      id="year"
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    >
                      <option value="">Select year</option>
                      {YEARS.map(year => (
                        <option key={year} value={year}>Year {year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select the skills and technologies you're proficient in
                  (select at least 3)
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map(skill => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-[#457B9D] hover:text-white"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedSkills.length} skills
                </p>
              </div>
            )}

            {/* Step 3: Social Links */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  These are optional but help teammates learn more about you
                </p>
              </>
            )}

            {/* Step 4: Bio */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and what you're looking for in a team..."
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Profile Summary</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Name: {formData.name || 'Not set'}</li>
                    <li>• Branch: {formData.branch || 'Not set'} - Year {formData.year || '-'}</li>
                    <li>• Skills: {selectedSkills.length} selected</li>
                    <li>• Social links: {[formData.github_url, formData.linkedin_url, formData.portfolio_url].filter(Boolean).length} added</li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || loading}
              >
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.name || !formData.roll_no || !formData.branch || !formData.year)) ||
                    (step === 2 && selectedSkills.length < 3)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Creating profile...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
