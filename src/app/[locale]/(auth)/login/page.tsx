"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLogin } from "@/hooks/use-auth"
import { authService } from "@/services/auth-service"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { trigger: login, isMutating: isPending, error } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  const handleOAuthLogin = (provider: "google" | "facebook") => {
    if (provider === "google") {
      window.location.href = authService.getGoogleAuthUrl()
    } else {
      window.location.href = authService.getFacebookAuthUrl()
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-sm bg-primary"></div>
            </div>
            <Link href="/" className="text-white text-lg font-semibold">
             <h1 className="text-xl font-semibold text-white">E-tourims</h1>
            </Link>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">Explore the world with seamless travel planning.</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your personalized travel dashboard and manage your bookings, itineraries, and
              transportation.
            </p>
          </div>
          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 E-tourims LTD.</span>
            <span className="cursor-pointer hover:text-white/90">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 bg-primary">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground">E-tourims</h1>
          </div>

          {showForgotPassword ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowForgotPassword(false)
              }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute left-8 top-8 p-2 hover:bg-muted cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl text-foreground">Reset Password</h2>
                <p className="text-muted-foreground">Enter your email address and we ll send you a reset link.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="user@company.com"
                  className="h-12 border-border focus:ring-0 shadow-none rounded-lg bg-background focus:border-primary"
                />
              </div>
              <Button className="w-full h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-none cursor-pointer">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl text-foreground">Welcome Back</h2>
                <p className="text-muted-foreground">Enter your email and password to access your account.</p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                  {error.message || "Error al iniciar sesión"}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-border focus:ring-0 shadow-none rounded-lg bg-background focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-10 border-border focus:ring-0 shadow-none rounded-lg bg-background focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-border cursor-pointer" />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember Me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80 cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Your Password?
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-none cursor-pointer"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or Login With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin("google")}
                  className="h-12 border-border hover:bg-muted hover:text-foreground rounded-lg bg-background shadow-none cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin("facebook")}
                  className="h-12 border-border hover:bg-muted hover:text-foreground rounded-lg bg-background shadow-none cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {"Don't Have An Account? "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                  Register Now.
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
