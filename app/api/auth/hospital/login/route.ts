import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password } = body

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const supabaseAdmin = getSupabaseAdmin()

        console.log('🔐 Login attempt:', { username: username.toLowerCase().trim() })

        // Find hospital by username
        const { data: hospital, error } = await supabaseAdmin
            .from('hospitals')
            .select('*')
            .eq('username', username.toLowerCase().trim())
            .eq('is_active', true)
            .single()

        if (error || !hospital) {
            console.error('❌ Hospital not found:', { username, error: error?.message })
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log('✅ Hospital found:', { id: hospital.id, name: hospital.name, hasPasswordHash: !!hospital.password_hash })

        // Check if password hash exists
        if (!hospital.password_hash) {
            console.error('❌ Hospital password_hash is missing:', { username, hospitalId: hospital.id })
            return NextResponse.json(
                { success: false, error: 'Account setup incomplete. Please contact administrator.' },
                { status: 500 }
            )
        }

        // Verify password
        console.log('🔍 Verifying password...')
        const isValid = await verifyPassword(password, hospital.password_hash)
        console.log('🔍 Password verification result:', isValid)

        if (!isValid) {
            console.error('❌ Password verification failed')
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log('✅ Login successful for:', hospital.name)

        // Update last login
        await supabaseAdmin
            .from('hospitals')
            .update({ last_login: new Date().toISOString() })
            .eq('id', hospital.id)

        // Return hospital data (excluding password_hash)
        const { password_hash, ...hospitalData } = hospital

        return NextResponse.json(
            {
                success: true,
                hospital: hospitalData,
                message: 'Login successful'
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
