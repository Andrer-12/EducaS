import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Tratamento de Handshake do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, captchaToken, action } = await req.json()

    if (!captchaToken) {
      return new Response(
        JSON.stringify({ error: 'Token de verificação ausente.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Validação do Token Humano junto à API da Cloudflare
    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (!secretKey) {
      throw new Error("Chave secreta do Turnstile não configurada no ambiente de nuvem.")
    }

    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', captchaToken)

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const outcome = await result.json()

    if (!outcome.success) {
      return new Response(
        JSON.stringify({ error: 'Falha na validação de segurança (Anti-Bot).' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Inicialização do Client do Supabase com privilégios administrativos
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 4. Roteamento Inteligente baseado na Ação do Usuário
    if (action === 'reset-password') {
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'E-mail obrigatório para redefinição.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Dispara o e-mail de recuperação padrão do Supabase Auth
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
      })

      if (resetError) throw resetError

      // Status 200 garante que o corpo JSON com a mensagem de sucesso seja enviado sem estourar o HTTP
      return new Response(
        JSON.stringify({ message: 'E-mail de redefinição enviado com sucesso.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    
    // FLUXO DE LOGIN CONVENCIONAL
    else {
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      return new Response(
        JSON.stringify({ session: data.session }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno no servidor de autenticação.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})