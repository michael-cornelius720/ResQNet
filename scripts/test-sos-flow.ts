
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSOSFlow() {
    console.log("🚀 Starting SOS Flow Test...");

    // 1. Create a Test Hospital (if not exists)
    const testHospital = {
        name: "Test General Hospital",
        username: "test_hospital", // Changed from email
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Test St, NY",
        phone: "1234567890",
        is_active: true,
        // password_hash is likely required, but let's see if we can skip or provide dummy
        password_hash: "$2a$10$abcdefg..."
    };

    // Check if it exists
    let { data: hospital } = await supabase
        .from("hospitals")
        .select("*")
        .eq("username", testHospital.username) // Use username
        .single();

    if (!hospital) {
        console.log("Creating test hospital...");
        const { data, error } = await supabase.from("hospitals").insert([testHospital]).select().single();
        if (error) {
            console.error("Failed to create hospital:", error);
            return;
        }
        hospital = data;
    }

    console.log(`🏥 Hospital ready: ${hospital.name} (${hospital.id})`);
    console.log(`   Location: ${hospital.latitude}, ${hospital.longitude}`);

    // 2. Simulate User SOS Request nearby
    const userLocation = {
        latitude: 40.7130, // Very close to hospital
        longitude: -74.0062
    };

    console.log("\n🆘 simulating SOS request...");
    const sosPayload = {
        phone: "9999999999",
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        name: "Test User",
        emergency_type: "Test SOS",
        radius_km: 50 // Large radius to ensure coverage
    };

    // We'll hit the API endpoint logically, but here we can just invoke the DB logic directly to trace it, 
    // OR use fetch to hit the local running server. 
    // Since we might not have the server running, let's replicate the API logic here to verify DB behavior.

    // Insert SOS
    const { data: emergency, error: sosError } = await supabase
        .from("sos_emergencies")
        .insert([{
            phone_number: sosPayload.phone,
            latitude: sosPayload.latitude,
            longitude: sosPayload.longitude,
            name: sosPayload.name,
            emergency_type: sosPayload.emergency_type,
            status: 'pending'
        }])
        .select()
        .single();

    if (sosError) {
        console.error("❌ Failed to create emergency:", sosError);
        return;
    }
    console.log(`✅ Emergency created: ${emergency.id}`);

    // 3. Simulate Backend Logic (Finding Hospitals)
    console.log("\n🔍 Searching for hospitals...");

    // Calculate bounding box for initial filtering (simulating the API fix)
    const latDelta = sosPayload.radius_km / 111;
    const lonDelta = sosPayload.radius_km / (111 * Math.cos(sosPayload.latitude * Math.PI / 180));

    const minLat = sosPayload.latitude - latDelta;
    const maxLat = sosPayload.latitude + latDelta;
    const minLon = sosPayload.longitude - lonDelta;
    const maxLon = sosPayload.longitude + latDelta;

    const { data: nearbyHospitals, error: searchError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLon)
        .lte('longitude', maxLon);

    if (searchError) {
        console.error("❌ Failed to fetch hospitals:", searchError);
        return;
    }

    console.log(`Fetched ${nearbyHospitals.length} hospitals.`);
    const foundTestHospital = nearbyHospitals.find(h => h.username === testHospital.username);
    console.log(`Test hospital in fetched list: ${foundTestHospital ? 'YES' : 'NO'}`);

    // Calculate distance
    const hospitalsWithDistance = nearbyHospitals.map(h => {
        // Simple Haversine
        const R = 6371;
        const dLat = (h.latitude - sosPayload.latitude) * Math.PI / 180;
        const dLon = (h.longitude - sosPayload.longitude) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(sosPayload.latitude * Math.PI / 180) * Math.cos(h.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return { ...h, distance: d };
    }).filter(h => h.distance <= sosPayload.radius_km);

    console.log(`Found ${hospitalsWithDistance.length} hospitals in range.`);

    if (hospitalsWithDistance.length === 0) {
        console.warn("⚠️ No hospitals found in range!");
        // Debug: show all hospitals
        console.log("All hospitals:", nearbyHospitals.map(h => ({ name: h.name, lat: h.latitude, lng: h.longitude })));
    }

    // 4. Create Notifications
    for (const h of hospitalsWithDistance) {
        console.log(`Creating notification for ${h.name} (${h.distance.toFixed(2)}km away)`);
        const { error: notifError } = await supabase
            .from('emergency_notifications')
            .insert({
                emergency_id: emergency.id,
                hospital_id: h.id,
                distance_km: h.distance
            });

        if (notifError) {
            console.error(`❌ Failed to notify ${h.name}:`, notifError);
        } else {
            console.log(`✅ Notified ${h.name}`);
        }
    }

    // 5. Verify Notification Exists via Select
    console.log("\n👀 Verifying notifications for hospital...");
    const { data: notifications, error: fetchNotifError } = await supabase
        .from("emergency_notifications")
        .select("*")
        .eq("hospital_id", hospital.id)
        .eq("emergency_id", emergency.id);

    if (fetchNotifError) {
        console.error("❌ Failed to fetch notifications:", fetchNotifError);
    } else {
        console.log("Notifications found:", notifications);
    }

    console.log("\n🏁 Test Complete");
}

testSOSFlow();
