/**
 * Simple test to verify a hospital login works
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testLogin() {
    // Get first hospital
    const { data: hospital } = await supabase
        .from('hospitals')
        .select('id, name, username, password_hash, is_active')
        .eq('is_active', true)
        .limit(1)
        .single()

    if (!hospital) {
        console.log('❌ No hospitals found')
        return
    }

    console.log('\n========================================')
    console.log('🏥 TEST HOSPITAL CREDENTIALS')
    console.log('========================================')
    console.log(`Name: ${hospital.name}`)
    console.log(`Username: ${hospital.username}`)
    console.log(`Password: hospital123`)
    console.log(`Has password_hash: ${!!hospital.password_hash}`)
    console.log('========================================\n')

    if (hospital.password_hash) {
        // Test password verification
        const testPassword = 'hospital123'
        const isValid = await bcrypt.compare(testPassword, hospital.password_hash)
        console.log(`✅ Password "hospital123" is ${isValid ? 'VALID ✓' : 'INVALID ✗'}`)
    } else {
        console.log('⚠️  No password hash set - run hash-hospital-passwords.ts first')
    }
}

testLogin().catch(console.error)
