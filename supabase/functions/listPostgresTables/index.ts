import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { connection } = await req.json()
    
    console.log('Connection details:', {
      host: connection.host,
      port: connection.port,
      database: connection.db_name,
      user: connection.db_username
      // Don't log password
    });

    // Create connection config
    const pool = new Pool({
      user: connection.db_username,
      password: connection.db_password,
      database: connection.db_name,
      hostname: connection.host,
      port: connection.port || 5432,
      tls: { enabled: true },
    }, 1)

    const client = await pool.connect()
    
    try {
      const result = await client.queryObject(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `)
      
      return new Response(JSON.stringify({ 
        tables: result.rows 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}) 