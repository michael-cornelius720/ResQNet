// app/api/emergency/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Validation helper
function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

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
      phone,
      latitude,
      longitude,
      name,
      location_text,
      emergency_type,
      description,
      blood_group,
      allergies,
      medical_conditions,
      user_notes,
      selected_hospital_id, // User can optionally select a specific hospital
      radius_km = 10 // Default 10km radius
    } = body;

    // Validate required fields
    if (!phone || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: phone, latitude, and longitude are required" },
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

    // Validate coordinates
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    console.log(`Creating SOS emergency for phone: ${phone}`);

    // Insert emergency data into sos_emergencies table
    const { data: emergencyData, error: dbError } = await supabaseAdmin
      .from("sos_emergencies")
      .insert([
        {
          phone_number: phone.trim(),
          name: name?.trim() || null,
          latitude: latitude,
          longitude: longitude,
          location_text: location_text || null,
          emergency_level: 'critical',
          emergency_type: emergency_type || null,
          description: description?.trim() || null,
          blood_group: blood_group || null,
          allergies: allergies?.trim() || null,
          medical_conditions: medical_conditions?.trim() || null,
          user_notes: user_notes?.trim() || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: `Failed to save emergency data: ${dbError.message}` },
        { status: 500 }
      );
    }

    console.log(`SOS Emergency created successfully with ID: ${emergencyData.id}`);

    // STEP 2: Find and notify nearby hospitals
    let notifiedHospitals = [];

    if (selected_hospital_id) {
      // User selected a specific hospital - only notify that one
      const { data: selectedHospital, error: hospitalError } = await supabaseAdmin
        .from('hospitals')
        .select('*')
        .eq('id', selected_hospital_id)
        .eq('is_active', true)
        .single();

      if (!hospitalError && selectedHospital) {
        const distance = calculateDistance(
          latitude,
          longitude,
          selectedHospital.latitude,
          selectedHospital.longitude
        );

        // Create notification for selected hospital
        await supabaseAdmin
          .from('emergency_notifications')
          .insert([{
            emergency_id: emergencyData.id,
            hospital_id: selectedHospital.id,
            distance_km: distance,
            notified_at: new Date().toISOString()
          }]);

        notifiedHospitals.push({
          id: selectedHospital.id,
          name: selectedHospital.name,
          distance: distance
        });
      }
    } else {
      // No specific hospital selected - notify all hospitals within radius
      const { data: nearbyHospitals, error: hospitalsError } = await supabaseAdmin
        .from('hospitals')
        .select('*')
        .eq('is_active', true);

      if (!hospitalsError && nearbyHospitals) {
        // Calculate distances and filter by radius
        const hospitalsWithDistance = nearbyHospitals
          .map(hospital => ({
            ...hospital,
            distance: calculateDistance(
              latitude,
              longitude,
              hospital.latitude,
              hospital.longitude
            )
          }))
          .filter(hospital => hospital.distance <= radius_km)
          .sort((a, b) => a.distance - b.distance); // Sort by nearest first

        // Create notifications for all nearby hospitals
        if (hospitalsWithDistance.length > 0) {
          const notifications = hospitalsWithDistance.map(hospital => ({
            emergency_id: emergencyData.id,
            hospital_id: hospital.id,
            distance_km: hospital.distance,
            notified_at: new Date().toISOString()
          }));

          await supabaseAdmin
            .from('emergency_notifications')
            .insert(notifications);

          notifiedHospitals = hospitalsWithDistance.map(h => ({
            id: h.id,
            name: h.name,
            distance: h.distance
          }));
        }
      }
    }

    console.log(`Notified ${notifiedHospitals.length} hospitals`);

    return NextResponse.json(
      {
        success: true,
        message: "Emergency created successfully",
        emergency: {
          id: emergencyData.id,
          phone_number: emergencyData.phone_number,
          name: emergencyData.name,
          latitude: emergencyData.latitude,
          longitude: emergencyData.longitude,
          status: emergencyData.status,
          emergency_level: emergencyData.emergency_level,
          created_at: emergencyData.created_at,
        },
        notified_hospitals: notifiedHospitals
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected emergency creation error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve emergencies
export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing environment variables",
        },
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
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const id = searchParams.get('id');
    const hospital_id = searchParams.get('hospital_id'); // NEW: Filter by hospital

    let query = supabaseAdmin
      .from('sos_emergencies')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by phone if provided
    if (phone) {
      query = query.eq('phone_number', phone);
    }

    // Filter by ID if provided
    if (id) {
      query = query.eq('id', id);
    }

    // NEW: Filter by hospital_id - show only emergencies notified to this hospital
    if (hospital_id) {
      // Get emergency IDs that this hospital was notified about
      const { data: notifications } = await supabaseAdmin
        .from('emergency_notifications')
        .select('emergency_id')
        .eq('hospital_id', hospital_id);

      if (notifications && notifications.length > 0) {
        const emergencyIds = notifications.map(n => n.emergency_id);
        query = query.in('id', emergencyIds);
      } else {
        // No notifications for this hospital
        return NextResponse.json(
          {
            success: true,
            data: [],
            count: 0
          },
          { status: 200 }
        );
      }
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
        count: Array.isArray(data) ? data.length : (data ? 1 : 0)
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update emergency status
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
      status,
      hospital_id, // Hospital that is approving
      assigned_ambulance_number,
      driver_name,
      driver_phone,
      admin_notes
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Emergency ID is required" },
        { status: 400 }
      );
    }

    // Check if emergency is already assigned to another hospital
    const { data: currentEmergency } = await supabaseAdmin
      .from('sos_emergencies')
      .select('status, assigned_hospital_name')
      .eq('id', id)
      .single();

    // If status is being changed to 'acknowledged' and emergency is pending
    if (status === 'acknowledged' && hospital_id) {
      if (currentEmergency?.status !== 'pending') {
        return NextResponse.json(
          {
            error: "Emergency already assigned to another hospital",
            assigned_to: currentEmergency?.assigned_hospital_name
          },
          { status: 409 } // Conflict
        );
      }

      // Get hospital details
      const { data: hospital } = await supabaseAdmin
        .from('hospitals')
        .select('*')
        .eq('id', hospital_id)
        .single();

      if (!hospital) {
        return NextResponse.json(
          { error: "Hospital not found" },
          { status: 404 }
        );
      }

      // Update emergency with hospital assignment
      const { data, error } = await supabaseAdmin
        .from('sos_emergencies')
        .update({
          status: 'acknowledged',
          assigned_hospital_name: hospital.name,
          assigned_hospital_lat: hospital.latitude,
          assigned_hospital_lng: hospital.longitude,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('status', 'pending') // Double-check it's still pending
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return NextResponse.json(
          { error: "Emergency already assigned to another hospital" },
          { status: 409 }
        );
      }

      // Mark this hospital's notification as responded
      await supabaseAdmin
        .from('emergency_notifications')
        .update({
          responded_at: new Date().toISOString(),
          response_type: 'approved'
        })
        .eq('emergency_id', id)
        .eq('hospital_id', hospital_id);

      // Mark other hospitals' notifications as timeout
      await supabaseAdmin
        .from('emergency_notifications')
        .update({
          response_type: 'timeout'
        })
        .eq('emergency_id', id)
        .neq('hospital_id', hospital_id);

      return NextResponse.json(
        {
          success: true,
          message: "Emergency assigned successfully",
          data: data
        },
        { status: 200 }
      );
    }

    // Regular update for other status changes
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (assigned_ambulance_number) updateData.assigned_ambulance_number = assigned_ambulance_number;
    if (driver_name) updateData.driver_name = driver_name;
    if (driver_phone) updateData.driver_phone = driver_phone;
    if (admin_notes) updateData.admin_notes = admin_notes;

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('sos_emergencies')
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
        message: "Emergency updated successfully",
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