import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

// GET /api/appointments - Fetch appointments (with optional hospital filter)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hospitalName = searchParams.get('hospitalName');
        const status = searchParams.get('status');

        let query = supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by hospital name if provided
        if (hospitalName) {
            // Use case-insensitive partial match to handle slight name variations
            query = query.ilike('hospital_name', `%${hospitalName}%`);
        }

        // Filter by status if provided
        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching appointments:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in GET /api/appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/appointments - Create new appointment request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            user_phone,
            user_name,
            blood_group,
            medical_conditions,
            issue_type,
            description,
            hospital_name,
            hospital_lat,
            hospital_lng,
            user_lat,
            user_lng,
        } = body;

        // Validation
        if (!user_phone || !issue_type || !hospital_name || !hospital_lat || !hospital_lng || !user_lat || !user_lng) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert appointment
        const { data, error } = await supabase
            .from('appointments')
            .insert([
                {
                    user_phone,
                    user_name,
                    blood_group,
                    medical_conditions,
                    issue_type,
                    description,
                    hospital_name,
                    hospital_lat,
                    hospital_lng,
                    user_lat,
                    user_lng,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating appointment:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/appointments - Update appointment status/details
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, assigned_doctor, appointment_time, notes } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

        const updates: any = {
            updated_at: new Date().toISOString(),
        };

        if (status) updates.status = status;
        if (assigned_doctor) updates.assigned_doctor = assigned_doctor;
        if (appointment_time) updates.appointment_time = appointment_time;
        if (notes !== undefined) updates.notes = notes;

        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating appointment:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in PATCH /api/appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
