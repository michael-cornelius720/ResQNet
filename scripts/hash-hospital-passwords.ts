/**
 * Script to hash passwords for all hospitals in the database
 * 
 * This script:
 * 1. Fetches all hospitals from the database
 * 2. Generates a password for each hospital (uses username as password for testing)
 * 3. Hashes the password using bcryptjs
 * 4. Updates the password_hash field in the database
 * 5. Prints credentials for testing
 * 
 * Usage: npx tsx scripts/hash-hospital-passwords.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables!')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

async function main() {
    console.log('🔐 Starting password hashing for hospitals...\n')

    // Fetch all hospitals
    const { data: hospitals, error } = await supabaseAdmin
        .from('hospitals')
        .select('id, username, name, password_hash')
        .order('name')

    if (error) {
        console.error('❌ Error fetching hospitals:', error)
        process.exit(1)
    }

    if (!hospitals || hospitals.length === 0) {
        console.log('⚠️  No hospitals found in database')
        process.exit(0)
    }

    console.log(`📊 Found ${hospitals.length} hospitals\n`)

    const credentials: Array<{ username: string; password: string; name: string }> = []

    // Process each hospital
    for (const hospital of hospitals) {
        try {
            // Use a default password for testing - you can change this to generate random passwords
            // For production, you should generate unique passwords and send them securely
            const password = 'hospital123' // Default password for all hospitals (change as needed)

            // Hash the password
            const passwordHash = await hashPassword(password)

            // Update the database
            const { error: updateError } = await supabaseAdmin
                .from('hospitals')
                .update({ password_hash: passwordHash })
                .eq('id', hospital.id)

            if (updateError) {
                console.error(`❌ Error updating ${hospital.name}:`, updateError)
                continue
            }

            credentials.push({
                name: hospital.name,
                username: hospital.username,
                password: password
            })

            console.log(`✅ Updated: ${hospital.name}`)
        } catch (err) {
            console.error(`❌ Error processing ${hospital.name}:`, err)
        }
    }

    // Print credentials
    console.log('\n' + '='.repeat(80))
    console.log('📋 HOSPITAL LOGIN CREDENTIALS')
    console.log('='.repeat(80) + '\n')

    credentials.forEach((cred, index) => {
        console.log(`${index + 1}. ${cred.name}`)
        console.log(`   Username: ${cred.username}`)
        console.log(`   Password: ${cred.password}`)
        console.log()
    })

    console.log('='.repeat(80))
    console.log('✨ Password hashing complete!')
    console.log('⚠️  NOTE: All hospitals are using the default password "hospital123"')
    console.log('    Change this in production or generate unique passwords per hospital')
}

main().catch(console.error)
