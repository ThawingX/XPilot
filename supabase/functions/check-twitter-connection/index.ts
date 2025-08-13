import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // 创建 Supabase 客户端
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://amugncveoxslbbxpyiar.supabase.co';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdWduY3Zlb3hzbGJieHB5aWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Mjk2MDgsImV4cCI6MjA2ODMwNTYwOH0.OWj4yXXkhg2nCDmmCxuCDsnd0iY2osvJbzcJvoO5sho';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({
      error: 'Supabase configuration missing',
      is_twitter_connected: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  // 从 Authorization 头部获取 Bearer Token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({
      error: 'No valid bearer token provided',
      is_twitter_connected: false
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    // 验证 Token 并获取用户 ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Invalid authentication token',
        is_twitter_connected: false
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    // 查询 user_social_connections 表
    const { data, error } = await supabase.from('user_social_connections').select('*').eq('user_id', user.id).eq('platform', 'twitter').eq('is_active', true);
    
    if (error) {
      // 如果是 PGRST116 错误（表不存在），返回未连接状态而不是错误
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({
          is_twitter_connected: false,
          connection_details: null
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      return new Response(JSON.stringify({
        error: error.message,
        error_code: error.code,
        is_twitter_connected: false
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // 处理查询结果 - data 现在是数组
    const hasActiveConnection = data && data.length > 0;
    const latestConnection = hasActiveConnection ? data[0] : null;
    
    return new Response(JSON.stringify({
      is_twitter_connected: hasActiveConnection,
      connection_details: latestConnection,
      total_connections: data ? data.length : 0
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (catchError) {
    return new Response(JSON.stringify({
      error: catchError instanceof Error ? catchError.message : 'Unknown error occurred',
      error_type: 'unexpected_error',
      is_twitter_connected: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
