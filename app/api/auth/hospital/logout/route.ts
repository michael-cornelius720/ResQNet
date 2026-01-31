import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    )
}
