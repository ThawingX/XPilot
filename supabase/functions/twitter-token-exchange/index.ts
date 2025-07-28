import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, codeVerifier, redirectUri, clientId, clientSecret } = await req.json()

    if (!code || !codeVerifier || !redirectUri || !clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: code, codeVerifier, redirectUri, clientId, clientSecret' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Exchanging code for tokens...')

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      client_id: clientId,
    })

    // Make the request to Twitter OAuth token endpoint
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: params.toString()
    })

    const responseData = await response.text()
    
    console.log(`Twitter OAuth token exchange status: ${response.status}`)
    console.log(`Twitter OAuth token exchange response: ${responseData}`)

    // Parse JSON if possible
    let parsedData
    try {
      parsedData = JSON.parse(responseData)
    } catch {
      parsedData = { error: 'Invalid JSON response', raw: responseData }
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: `Twitter OAuth token exchange error: ${response.status} ${response.statusText}`,
          details: parsedData
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(parsedData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})