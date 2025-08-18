
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CredentialRequest {
  service_name: string;
  credentials: any;
  action: 'store' | 'retrieve' | 'delete';
}

// Simple encryption/decryption using Web Crypto API
async function encryptCredentials(data: string, key: CryptoKey): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result;
}

async function decryptCredentials(encryptedData: Uint8Array, key: CryptoKey): Promise<string> {
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const keyMaterial = new TextEncoder().encode(Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-in-production');
  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const salt = new TextEncoder().encode('qosim-salt');
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { service_name, credentials, action }: CredentialRequest = await req.json();

    const encryptionKey = await getEncryptionKey();

    switch (action) {
      case 'store': {
        const encryptedCredentials = await encryptCredentials(JSON.stringify(credentials), encryptionKey);
        
        const { error } = await supabaseClient
          .from('user_credentials')
          .upsert({
            user_id: user.id,
            service_name,
            encrypted_credentials: Array.from(encryptedCredentials),
          });

        if (error) throw error;

        // Log security event
        await supabaseClient
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            event_type: 'credential_stored',
            event_data: { service_name },
            ip_address: req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For'),
            user_agent: req.headers.get('User-Agent'),
          });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'retrieve': {
        const { data, error } = await supabaseClient
          .from('user_credentials')
          .select('encrypted_credentials')
          .eq('user_id', user.id)
          .eq('service_name', service_name)
          .single();

        if (error || !data) {
          return new Response(
            JSON.stringify({ error: 'Credentials not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const encryptedData = new Uint8Array(data.encrypted_credentials);
        const decryptedCredentials = await decryptCredentials(encryptedData, encryptionKey);

        return new Response(
          JSON.stringify({ credentials: JSON.parse(decryptedCredentials) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { error } = await supabaseClient
          .from('user_credentials')
          .delete()
          .eq('user_id', user.id)
          .eq('service_name', service_name);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Credential management error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
