import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

/**
 * POST /api/auth/hospital/forgot-password
 * 
 * Generates a password reset token for a hospital
 * Returns the token in the response (for demo purposes)
 * 
 * In production, you would:
 * 1. Send the token via email to the hospital's registered email
 * 2. Not return the token in the response
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username } = body

        if (!username) {
            return NextResponse.json(
                { success: false, error: 'Username is required' },
                { status: 400 }
            )
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Find hospital by username
        const { data: hospital, error } = await supabaseAdmin
            .from('hospitals')
            .select('id, username, email, name')
            .eq('username', username.toLowerCase().trim())
            .eq('is_active', true)
            .single()

        if (error || !hospital) {
            // Don't reveal if hospital exists for security
            return NextResponse.json(
                { success: false, error: 'If this username exists, a reset token has been generated' },
                { status: 404 }
            )
        }

        // Generate a secure random reset token
        const resetToken = crypto.randomBytes(32).toString('hex')

        // Token expires in 1 hour
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)

        // Update hospital with reset token
        const { error: updateError } = await supabaseAdmin
            .from('hospitals')
            .update({
                reset_token: resetToken,
                reset_token_expires: expiresAt.toISOString()
            })
            .eq('id', hospital.id)

        if (updateError) {
            console.error('Error updating reset token:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to generate reset token' },
                { status: 500 }
            )
        }

        console.log(`Password reset requested for: ${hospital.name} (${hospital.username})`)
        console.log(`Reset token: ${resetToken}`)
        console.log(`Expires at: ${expiresAt.toISOString()}`)

        // TODO: In production, send email with reset link instead of returning token
        // Example: await sendResetEmail(hospital.email, resetToken)

        return NextResponse.json(
            {
                success: true,
                message: 'Reset token generated successfully',
                resetToken, // Only for demo - remove in production!
                expiresAt: expiresAt.toISOString()
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
