/**
 * Quick fix: Set ONE hospital with a known password for immediate testing
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTestHospital() {
    console.log('🔧 Setting up test hospital credentials...\n')

    // Get first active hospital
    const { data: hospital, error } = await supabase
        .from('hospitals')
        .select('id, name, username')
        .eq('is_active', true)
        .limit(1)
        .single()

    if (error || !hospital) {
        console.error('❌ Error finding hospital:', error)
        return
    }

    const testPassword = 'test123'

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(testPassword, salt)

    // Update the hospital
    const { error: updateError } = await supabase
        .from('hospitals')
        .update({ password_hash: passwordHash })
        .eq('id', hospital.id)

    if (updateError) {
        console.error('❌ Error updating hospital:', updateError)
        return
    }

    console.log('✅ Test hospital configured!\n')
    console.log('========================================')
    console.log('🏥 TEST LOGIN CREDENTIALS')
    console.log('========================================')
    console.log(`Hospital: ${hospital.name}`)
    console.log(`Username: ${hospital.username}`)
    console.log(`Password: ${testPassword}`)
    console.log('========================================\n')
    console.log('💡 Try logging in at: http://localhost:3000/login\n')
}

setupTestHospital().catch(console.error)
