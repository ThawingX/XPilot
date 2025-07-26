import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Chrome, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginProps {
  onClose?: () => void
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        if (isSignUp) {
          setError('注册成功！请检查您的邮箱以验证账户。')
        } else {
          onClose?.()
        }
      }
    } catch (err) {
      setError('发生未知错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Google登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#E8F2FF' }}>
              <LogIn className="w-8 h-8" style={{ color: '#4792E6' }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? '创建账户' : '欢迎回来'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? '注册您的新账户' : '登录到您的账户'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style={{ '--tw-ring-color': '#4792E6' } as React.CSSProperties}
                  placeholder="输入您的邮箱"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style={{ '--tw-ring-color': '#4792E6' } as React.CSSProperties}
                  placeholder="输入您的密码"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ 
                backgroundColor: '#4792E6',
                '--tw-ring-color': '#4792E6'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#3A7BD5'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#4792E6'
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  处理中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isSignUp ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                  {isSignUp ? '注册' : '登录'}
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">或</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ '--tw-ring-color': '#4792E6' } as React.CSSProperties}
          >
            <div className="flex items-center justify-center">
              <Chrome className="w-5 h-5 mr-2 text-blue-500" />
              使用 Google 登录
            </div>
          </button>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? '已有账户？' : '还没有账户？'}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="ml-1 font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#4792E6' }}
              >
                {isSignUp ? '立即登录' : '立即注册'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login