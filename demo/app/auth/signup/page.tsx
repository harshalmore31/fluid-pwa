'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { GitBranch } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate VIT email
    if (!email.endsWith('@vit.edu.in')) {
      setMessage({ type: 'error', text: 'Please use your VIT email address (@vit.edu.in)' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?onboarding=true`,
        },
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link to complete your registration!'
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1FAEE] via-[#A8DADC] to-[#457B9D] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#457B9D] rounded-xl flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Join TeamSync</CardTitle>
          <CardDescription>
            Create your account to start finding teammates for hackathons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">VIT Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@vit.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                You must use your official VIT email address
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[#457B9D] hover:underline font-medium">
                Sign in
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-[#457B9D]">
                ← Back to home
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-sm mb-2">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-[#457B9D] mr-2">✓</span>
                <span>Smart teammate matching based on skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#457B9D] mr-2">✓</span>
                <span>Performance tracking and badges</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#457B9D] mr-2">✓</span>
                <span>Real-time team collaboration</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#457B9D] mr-2">✓</span>
                <span>Access to all VIT hackathons</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
