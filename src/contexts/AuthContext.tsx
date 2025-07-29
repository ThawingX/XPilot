import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 处理OAuth回调
    const handleOAuthCallback = async () => {
      const hash = window.location.hash
      const urlParams = new URLSearchParams(window.location.search)
      
      // 检查是否有OAuth回调参数
      if (hash.includes('access_token') || hash.includes('error') || urlParams.has('code')) {
        try {
          // 让Supabase处理OAuth回调
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('AuthContext: OAuth回调处理错误:', error)
          } else if (data.session) {
            setSession(data.session)
            setUser(data.session.user)
          }
        } catch (err) {
          console.error('AuthContext: OAuth回调异常:', err)
        }
        
        // 清理URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
    
    // 先处理OAuth回调，然后获取会话
    const initAuth = async () => {
      await handleOAuthCallback()
      
      // 获取当前会话
      const { data: { session }, error } = await supabase.auth.getSession()
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }
    
    initAuth()

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session)
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session)
        setUser(session.user)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      return { error }
    } catch (err) {
      console.error('Google登录错误:', err)
      return { error: err as AuthError }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}