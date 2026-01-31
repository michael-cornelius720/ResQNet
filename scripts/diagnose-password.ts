/**
 * Check what password hash exists and test different passwords
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function diagnosePassword() {
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
    console.log('🔍 PASSWORD DIAGNOSIS')
    console.log('========================================')
    console.log(`Hospital: ${hospital.name}`)
    console.log(`Username: ${hospital.username}`)
    console.log(`Has password_hash: ${!!hospital.password_hash}`)

    if (hospital.password_hash) {
        console.log(`Password hash: ${hospital.password_hash.substring(0, 20)}...`)
        console.log('========================================\n')

        // Test common passwords
        const testPasswords = [
            'hospital123',
            hospital.username,  // username as password
            hospital.name,      // hospital name as password
            'password',
            '123456',
            'admin'
        ]

        console.log('Testing common passwords...\n')

        for (const pwd of testPasswords) {
            try {
                const isValid = await bcrypt.compare(pwd, hospital.password_hash)
                const symbol = isValid ? '✅' : '❌'
                console.log(`${symbol} "${pwd}": ${isValid ? 'VALID' : 'invalid'}`)

                if (isValid) {
                    console.log('\n🎉 FOUND THE PASSWORD!')
                    console.log('========================================')
                    console.log(`Username: ${hospital.username}`)
                    console.log(`Password: ${pwd}`)
                    console.log('========================================\n')
                    return
                }
            } catch (e) {
                console.log(`❓ "${pwd}": error testing`)
            }
        }

        console.log('\n⚠️  None of the common passwords matched')
        console.log('The password hash might be from a different password')
    } else {
        console.log('⚠️  No password hash set')
        console.log('Run: npx tsx scripts/hash-hospital-passwords.ts')
    }
    console.log('========================================\n')
}

diagnosePassword().catch(console.error)
