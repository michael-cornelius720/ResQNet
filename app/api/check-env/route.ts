// app/api/check-env/route.ts
// This endpoint helps you verify your environment variables are loaded

import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    // Boolean checks
    hasUrl: !!url,
    hasAnonKey: !!anonKey,
    hasServiceKey: !!serviceKey,
    
    // Previews (first 30 chars for security)
    urlPreview: url ? url.substring(0, 30) + "..." : "❌ NOT SET",
    anonKeyPreview: anonKey ? anonKey.substring(0, 20) + "..." : "❌ NOT SET",
    serviceKeyPreview: serviceKey ? serviceKey.substring(0, 20) + "..." : "❌ NOT SET",
    
    // Summary
    allVariablesSet: !!url && !!anonKey && !!serviceKey,
    message: (!!url && !!anonKey && !!serviceKey) 
      ? "✅ All environment variables are set correctly!" 
      : "❌ Some environment variables are missing. Check .env.local file.",
    
    // Instructions
    nextSteps: (!!url && !!anonKey && !!serviceKey)
      ? "You can now test the signup page at /signup"
      : "1. Create .env.local in project root\n2. Add your Supabase credentials\n3. Restart dev server\n4. Refresh this page"
  });
}