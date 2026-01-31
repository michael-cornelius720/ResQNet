/**
 * Test script to check emergency notifications
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkNotifications() {
    console.log('\n========================================')
    console.log('🔍 CHECKING EMERGENCY NOTIFICATIONS')
    console.log('========================================\n')

    // Get University Medical Center hospital info
    const { data: hospital } = await supabase
        .from('hospitals')
        .select('id, name, username')
        .eq('username', 'university_medi_4d57')
        .single()

    if (!hospital) {
        console.log('❌ Hospital not found')
        return
    }

    console.log(`Hospital: ${hospital.name}`)
    console.log(`ID: ${hospital.id}\n`)

    // Check for emergency notifications
    const { data: notifications, error: notifError } = await supabase
        .from('emergency_notifications')
        .select('*')
        .eq('hospital_id', hospital.id)

    if (notifError) {
        console.error('❌ Error fetching notifications:', notifError)
        return
    }

    console.log(`📋 Notifications for this hospital: ${notifications?.length || 0}\n`)

    if (notifications && notifications.length > 0) {
        for (const notif of notifications) {
            // Get emergency details
            const { data: emergency } = await supabase
                .from('sos_emergencies')
                .select('*')
                .eq('id', notif.emergency_id)
                .single()

            console.log(`Emergency ID: ${notif.emergency_id}`)
            console.log(`  Status: ${emergency?.status || 'unknown'}`)
            console.log(`  Phone: ${emergency?.phone_number || 'unknown'}`)
            console.log(`  Distance: ${notif.distance_km?.toFixed(2)} km`)
            console.log(`  Notified at: ${notif.notified_at}`)
            console.log()
        }
    } else {
        console.log('⚠️  No emergency notifications found for this hospital')
        console.log('\nChecking all recent emergencies:')

        const { data: allEmergencies } = await supabase
            .from('sos_emergencies')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        console.log(`\n📊 Last 5 emergencies in database:`)
        if (allEmergencies && allEmergencies.length > 0) {
            allEmergencies.forEach((e, i) => {
                console.log(`\n${i + 1}. ID: ${e.id}`)
                console.log(`   Phone: ${e.phone_number}`)
                console.log(`   Status: ${e.status}`)
                console.log(`   Created: ${e.created_at}`)
            })
        } else {
            console.log('No emergencies found in database')
        }
    }

    console.log('\n========================================\n')
}

checkNotifications().catch(console.error)
