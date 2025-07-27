import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import GoogleLoginButton from './GoogleLoginButton'
import { User, LogOut, Mail, Calendar, Shield } from 'lucide-react'

const GoogleLoginTest: React.FC = () => {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">登录成功！</h2>
            <p className="text-gray-600">欢迎使用Google登录</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">用户ID</p>
                <p className="font-medium text-gray-900 text-xs">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">注册时间</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            退出登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Google登录测试</h2>
          <p className="text-gray-600">测试Google OAuth登录功能</p>
        </div>

        <div className="space-y-4">
          <GoogleLoginButton
            onSuccess={() => console.log('Google登录成功')}
            onError={(error) => console.error('Google登录失败:', error)}
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              点击上方按钮测试Google登录功能
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleLoginTest