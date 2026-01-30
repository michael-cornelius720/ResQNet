// app/api/auth/signup/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validation helpers
function validateEmail(email_id: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email_id);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export async function POST(request: NextRequest) {
  try {
    // Check environment variables first
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      email_id,
      password,
      bloodGroup,
      allergies,
      medicalConditions,
    } = body;

    // Validate required fields
    if (!name || !phone || !email_id || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email_id)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const { data: existingUser } = await supabaseAdmin
        .from("emergencies")
        .select("email_id")
        .eq("email_id", email_id.toLowerCase())
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
    } catch (e) {
      // If error is "no rows returned", user doesn't exist - this is fine
      // Any other error should be handled
      console.log("Email check:", e);
    }

    console.log(`Creating auth user for email: ${email_id}`);

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: email_id.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
          phone: phone.trim(),
        },
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to create user account" },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "User creation failed - no user returned" },
        { status: 400 }
      );
    }

    console.log(`Auth user created with ID: ${authData.user.id}`);

    // Step 2: Store user data in emergencies table
    const { data: userData, error: dbError } = await supabaseAdmin
      .from("emergencies")
      .insert([
        {
          user_id: authData.user.id,
          name: name.trim(),
          phone_number: phone.trim(),
          password: phone.trim(),
          email: email_id.trim().toLowerCase(),
          blood_group: bloodGroup || null,
          allergies: allergies?.trim() || null,
          medical_conditions: medicalConditions?.trim() || null,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      
      // Rollback: Delete the auth user if database insert fails
      console.log(`Rolling back - deleting auth user ${authData.user.id}`);
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log("Rollback successful");
      } catch (deleteError) {
        console.error("Rollback failed:", deleteError);
      }
      
      return NextResponse.json(
        { error: `Failed to save user data: ${dbError.message}` },
        { status: 500 }
      );
    }

    console.log(`User data saved successfully for user ${authData.user.id}`);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully. Please check your email to verify your account.",
        user: {
          id: authData.user.id,
          email_id: authData.user.email,
          name: userData.name,
          phone_number: userData.phone_number,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected signup error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred during signup. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Missing environment variables",
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: "ok",
        message: "Signup API is ready",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: "error",
        message: error.message
      },
      { status: 500 }
    );
  }
}