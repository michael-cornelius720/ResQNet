// app/api/ambulances/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch all ambulances
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospital_id');
    const isAvailable = searchParams.get('is_available');

    let query = supabaseAdmin
      .from('ambulances')
      .select('*')
      .order('vehicle_number');

    // Filter by hospital if provided
    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    }

    // Filter by availability if provided
    if (isAvailable !== null) {
      query = query.eq('is_available', isAvailable === 'true');
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

// POST - Create new ambulance
export async function POST(request: NextRequest) {
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
    const { 
      hospital_id,
      vehicle_number, 
      driver_name, 
      driver_phone,
      is_available
    } = body;

    if (!hospital_id || !vehicle_number || !driver_name || !driver_phone) {
      return NextResponse.json(
        { error: "Missing required fields: hospital_id, vehicle_number, driver_name, and driver_phone are required" },
        { status: 400 }
      );
    }

    // Verify hospital exists
    const { data: hospital, error: hospitalError } = await supabaseAdmin
      .from('hospitals')
      .select('id')
      .eq('id', hospital_id)
      .single();

    if (hospitalError || !hospital) {
      return NextResponse.json(
        { error: "Invalid hospital ID" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('ambulances')
      .insert([
        {
          hospital_id,
          vehicle_number: vehicle_number.trim(),
          driver_name: driver_name.trim(),
          driver_phone: driver_phone.trim(),
          is_available: is_available !== undefined ? is_available : true,
        }
      ])
      .select()
      .single();

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
        message: "Ambulance created successfully",
        data: data
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PATCH - Update ambulance
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
    const { 
      id,
      is_available,
      vehicle_number,
      driver_name,
      driver_phone
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Ambulance ID is required" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};

    if (is_available !== undefined) updateData.is_available = is_available;
    if (vehicle_number) updateData.vehicle_number = vehicle_number.trim();
    if (driver_name) updateData.driver_name = driver_name.trim();
    if (driver_phone) updateData.driver_phone = driver_phone.trim();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('ambulances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

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
        message: "Ambulance updated successfully",
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

// DELETE - Delete ambulance
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Ambulance ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('ambulances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ambulance deleted successfully"
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected delete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}