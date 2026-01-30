// app/api/emergency-notifications/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch notifications for a hospital
export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { searchParams } = new URL(request.url);
    const hospital_id = searchParams.get('hospital_id');
    const emergency_id = searchParams.get('emergency_id');

    let query = supabaseAdmin
      .from('emergency_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (hospital_id) {
      query = query.eq('hospital_id', hospital_id);
    }

    if (emergency_id) {
      query = query.eq('emergency_id', emergency_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: data,
        count: data.length
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification as viewed
export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const body = await request.json();
    const { notification_id, emergency_id, hospital_id, viewed } = body;

    let query = supabaseAdmin.from('emergency_notifications');

    if (notification_id) {
       query = query.update({ viewed_at: viewed ? new Date().toISOString() : null })
        .eq('id', notification_id);
    } else if (emergency_id && hospital_id) {
      query = query.update({ viewed_at: viewed ? new Date().toISOString() : null })
        .eq('emergency_id', emergency_id)
        .eq('hospital_id', hospital_id);
    } else {
      return NextResponse.json(
        { error: "notification_id or (emergency_id and hospital_id) required" },
        { status: 400 }
      );
    }

    const { data, error } = await query.select();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification updated successfully",
        data: data
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}