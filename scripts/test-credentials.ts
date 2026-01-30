/**
 * Diagnostic script to verify password hashing and test credentials
 * 
 * This will:
 * 1. Check if password_hash exists for a specific hospital
 * 2. Verify the password hash is valid
 * 3. Test if bcrypt can verify the password correctly
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables!')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function testCredentials() {
    const testUsername = 'public_health_c_7394'
    const testPassword = 'hospital123'

    console.log('🔍 Diagnostic Check for Hospital Login\n')
    console.log('='.repeat(80))
    console.log(`Testing Username: ${testUsername}`)
    console.log(`Testing Password: ${testPassword}`)
    console.log('='.repeat(80) + '\n')

    // Fetch the hospital
    const { data: hospital, error } = await supabaseAdmin
        .from('hospitals')
        .select('id, username, name, password_hash, is_active')
        .eq('username', testUsername)
        .single()

    if (error) {
        console.error('❌ Error fetching hospital:', error)
        return
    }

    if (!hospital) {
        console.error('❌ Hospital not found!')
        return
    }

    console.log('✅ Hospital Found:')
    console.log(`   ID: ${hospital.id}`)
    console.log(`   Name: ${hospital.name}`)
    console.log(`   Username: ${hospital.username}`)
    console.log(`   Is Active: ${hospital.is_active}`)
    console.log(`   Password Hash Exists: ${hospital.password_hash ? 'YES' : 'NO'}`)

    if (hospital.password_hash) {
        console.log(`   Password Hash: ${hospital.password_hash.substring(0, 20)}...`)

        // Test bcrypt comparison
        console.log('\n🔐 Testing Password Verification...')
        try {
            const isValid = await bcrypt.compare(testPassword, hospital.password_hash)
            console.log(`   bcrypt.compare result: ${isValid ? '✅ MATCH' : '❌ NO MATCH'}`)

            if (!isValid) {
                // Try to hash the test password and see what we get
                console.log('\n🔬 Hashing test password for comparison...')
                const testHash = await bcrypt.hash(testPassword, 10)
                console.log(`   Test hash: ${testHash.substring(0, 20)}...`)
                console.log(`   Original: ${hospital.password_hash.substring(0, 20)}...`)
            }
        } catch (err) {
            console.error('❌ bcrypt.compare error:', err)
        }
    } else {
        console.log('\n❌ No password hash found! The password hashing script may not have worked.')
        console.log('   Run: npx tsx scripts/hash-hospital-passwords.ts')
    }

    console.log('\n' + '='.repeat(80))
}

testCredentials().catch(console.error)
