import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Edge function 'update-user-status' invoked.");
    const { user_id, status } = await req.json()
    console.log(`Received user_id: ${user_id}, status: ${status}`);

    const adminAuthClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    console.log("Admin auth client created.");

    let response;
    if (status === 'suspended') {
      console.log(`Attempting to suspend user: ${user_id}`);
      response = await adminAuthClient.auth.admin.updateUserById(
        user_id,
        { ban_duration: '9999h' } // Reverting to long duration ban
      )
      console.log("Supabase auth response for suspend:", response);
      if (response.error) throw response.error
    } else if (status === 'active') {
      console.log(`Attempting to activate user: ${user_id}`);
      response = await adminAuthClient.auth.admin.updateUserById(
        user_id,
        { ban_duration: '0s' }
      )
      console.log("Supabase auth response for activate:", response);
      if (response.error) throw response.error
    }

    console.log("User auth status updated successfully in Edge Function.");
    return new Response(JSON.stringify({ message: "User auth status updated successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})