
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

// Enhanced encryption/decryption using Web Crypto API
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
  const encryptionKeyEnv = Deno.env.get('ENCRYPTION_KEY');
  
  if (!encryptionKeyEnv) {
    throw new Error('ENCRYPTION_KEY environment variable is required but not set');
  }
  
  const keyMaterial = new TextEncoder().encode(encryptionKeyEnv);
  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const salt = new TextEncoder().encode('qosim-secure-salt-v2');
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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    if (!service_name || !action) {
      return new Response(
        JSON.stringify({ error: 'service_name and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const encryptionKey = await getEncryptionKey();

    switch (action) {
      case 'store': {
        if (!credentials) {
          return new Response(
            JSON.stringify({ error: 'credentials are required for store action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const encryptedCredentials = await encryptCredentials(JSON.stringify(credentials), encryptionKey);
        
        const { error } = await supabaseClient
          .from('user_credentials')
          .upsert({
            user_id: user.id,
            service_name,
            encrypted_credentials: Array.from(encryptedCredentials),
          });

        if (error) {
          console.error('Database error storing credentials:', error);
          throw new Error('Failed to store credentials in database');
        }

        // Log security event with minimal data
        console.log(`[SECURITY] Credentials stored for user ${user.id}, service: ${service_name}`);

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

        console.log(`[SECURITY] Credentials retrieved for user ${user.id}, service: ${service_name}`);

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

        if (error) {
          console.error('Database error deleting credentials:', error);
          throw new Error('Failed to delete credentials from database');
        }

        console.log(`[SECURITY] Credentials deleted for user ${user.id}, service: ${service_name}`);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Must be store, retrieve, or delete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Credential management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
