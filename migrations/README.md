# Database Migration: Add Password Hash to Hospitals

## Issue
The `hospitals` table is missing the `password_hash` column needed for authentication.

## Steps to Fix

### 1. Add the password_hash column to your database

You have two options:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://ijtqwcpymgixjtuibbme.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from `migrations/add_password_hash_to_hospitals.sql`:
   ```sql
   ALTER TABLE hospitals 
   ADD COLUMN IF NOT EXISTS password_hash TEXT;
   ```
5. Click **Run** to execute the migration

#### Option B: Using Supabase CLI
If you have the Supabase CLI installed:
```bash
supabase db push
```

### 2. Hash existing passwords

After adding the column, run the password hashing script:

```bash
npx tsx scripts/hash-hospital-passwords.ts
```

This will:
- Hash passwords for all hospitals in the database
- Set the default password to `hospital123` for all hospitals
- Print out all credentials for testing

### 3. Test the login

Try logging in with any hospital using:
- **Username**: The hospital's username (e.g., `public_health_c_7394`)
- **Password**: `hospital123`

## Production Considerations

⚠️ **IMPORTANT**: For production use:

1. **Generate unique passwords** for each hospital instead of using the same default password
2. **Securely distribute passwords** to hospital administrators
3. **Implement password reset** functionality
4. **Make password_hash NOT NULL** after all passwords are set:
   ```sql
   ALTER TABLE hospitals ALTER COLUMN password_hash SET NOT NULL;
   ```

## Troubleshooting

If you still get login errors after running the script:
1. Check that the script completed successfully
2. Verify the password_hash column has values: Go to Supabase → Table Editor → hospitals table
3. Check the terminal logs for any bcrypt errors
