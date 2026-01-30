import bcrypt from 'bcryptjs'

export interface HospitalSession {
    id: string
    email: string
    name: string
    address: string
    phone: string
    latitude: number
    longitude: number
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        if (!password || !hash) {
            console.error('verifyPassword: Missing password or hash')
            return false
        }
        return await bcrypt.compare(password, hash)
    } catch (error) {
        console.error('verifyPassword error:', error)
        return false
    }
}

// Get hospital from session storage (client-side)
export function getHospitalSession(): HospitalSession | null {
    if (typeof window === 'undefined') return null

    const sessionData = localStorage.getItem('hospital_session')
    if (!sessionData) return null

    try {
        return JSON.parse(sessionData)
    } catch {
        return null
    }
}

// Set hospital session (client-side)
export function setHospitalSession(hospital: HospitalSession): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('hospital_session', JSON.stringify(hospital))
}

// Clear hospital session (client-side)
export function clearHospitalSession(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('hospital_session')
}

// Check if hospital is authenticated
export function isHospitalAuthenticated(): boolean {
    return getHospitalSession() !== null
}
