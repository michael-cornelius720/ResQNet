/**
 * Quick script to list available hospital usernames for testing login
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
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

async function main() {
    console.log('📋 Fetching first 10 hospitals for testing...\n')

    const { data: hospitals, error } = await supabaseAdmin
        .from('hospitals')
        .select('id, name, username, password_hash, is_active')
        .eq('is_active', true)
        .limit(10)
        .order('name')

    if (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }

    if (!hospitals || hospitals.length === 0) {
        console.log('⚠️  No active hospitals found')
        process.exit(0)
    }

    console.log('='.repeat(80))
    console.log('🏥 AVAILABLE HOSPITAL CREDENTIALS FOR TESTING')
    console.log('='.repeat(80))
    console.log('\n⚠️  Default password for all hospitals: hospital123\n')

    hospitals.forEach((h, i) => {
        console.log(`${i + 1}. ${h.name}`)
        console.log(`   Username: ${h.username}`)
        console.log(`   Has Password: ${h.password_hash ? '✅ Yes' : '❌ No'}`)
        console.log(`   Status: ${h.is_active ? '🟢 Active' : '🔴 Inactive'}`)
        console.log()
    })

    console.log('='.repeat(80))
}

main().catch(console.error)
