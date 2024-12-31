import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Helper function to serialize BigInt
const serializeValue = (value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { connection, tableName } = await req.json()
    
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
        SELECT * FROM "${tableName}"
        LIMIT 1000;
      `)
      
      // Serialize the rows to handle BigInt values
      const serializedRows = result.rows.map(row => {
        const serializedRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          serializedRow[key] = serializeValue(value);
        }
        return serializedRow;
      });

      return new Response(JSON.stringify({ 
        rows: serializedRows 
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