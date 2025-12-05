import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { Database } from '@/types/database';

const supabaseUrl = SUPABASE_URL || '';
const supabaseAnonKey = SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
    console.warn(
        '⚠️ Supabase environment variables are missing.\n' +
        'Authentication and database features will not work.\n' +
        'Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.'
    );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);

export const isSupabaseConfigured = isConfigured;
