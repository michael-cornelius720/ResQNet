import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

/**
 * POST /api/auth/hospital/reset-password
 * 
 * Resets a hospital's password using a valid reset token
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, resetToken, newPassword } = body

        if (!username || !resetToken || !newPassword) {
            return NextResponse.json(
                { success: false, error: 'Username, reset token, and new password are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 8 characters long' },
                { status: 400 }
            )
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Find hospital by username and reset token
        const { data: hospital, error } = await supabaseAdmin
            .from('hospitals')
            .select('id, username, name, reset_token, reset_token_expires')
            .eq('username', username.toLowerCase().trim())
            .eq('is_active', true)
            .single()

        if (error || !hospital) {
            return NextResponse.json(
                { success: false, error: 'Invalid username or reset token' },
                { status: 401 }
            )
        }

        // Validate reset token
        if (!hospital.reset_token || hospital.reset_token !== resetToken) {
            return NextResponse.json(
                { success: false, error: 'Invalid reset token' },
                { status: 401 }
            )
        }

        // Check if token has expired
        if (!hospital.reset_token_expires || new Date(hospital.reset_token_expires) < new Date()) {
            // Clear expired token
            await supabaseAdmin
                .from('hospitals')
                .update({
                    reset_token: null,
                    reset_token_expires: null
                })
                .eq('id', hospital.id)

            return NextResponse.json(
                { success: false, error: 'Reset token has expired. Please request a new one.' },
                { status: 401 }
            )
        }

        // Hash the new password
        const passwordHash = await hashPassword(newPassword)

        // Update password and clear reset token
        const { error: updateError } = await supabaseAdmin
            .from('hospitals')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expires: null
            })
            .eq('id', hospital.id)

        if (updateError) {
            console.error('Error updating password:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to reset password' },
                { status: 500 }
            )
        }

        console.log(`Password reset successful for: ${hospital.name} (${hospital.username})`)

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset successful'
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
