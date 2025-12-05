export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    preferences: Record<string, unknown>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    preferences?: Record<string, unknown>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    preferences?: Record<string, unknown>;
                    updated_at?: string;
                };
            };
            recipients: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    relationship: string | null;
                    birth_date: string | null;
                    interests: string[];
                    preferences: Record<string, unknown>;
                    notes: string | null;
                    embedding: number[] | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    relationship?: string | null;
                    birth_date?: string | null;
                    interests?: string[];
                    preferences?: Record<string, unknown>;
                    notes?: string | null;
                    embedding?: number[] | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    relationship?: string | null;
                    birth_date?: string | null;
                    interests?: string[];
                    preferences?: Record<string, unknown>;
                    notes?: string | null;
                    embedding?: number[] | null;
                    updated_at?: string;
                };
            };
            occasions: {
                Row: {
                    id: string;
                    user_id: string;
                    recipient_id: string | null;
                    name: string;
                    date: string | null;
                    recurring: boolean;
                    reminder_days: number;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipient_id?: string | null;
                    name: string;
                    date?: string | null;
                    recurring?: boolean;
                    reminder_days?: number;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    recipient_id?: string | null;
                    name?: string;
                    date?: string | null;
                    recurring?: boolean;
                    reminder_days?: number;
                    notes?: string | null;
                    updated_at?: string;
                };
            };
            gift_ideas: {
                Row: {
                    id: string;
                    user_id: string;
                    recipient_id: string | null;
                    occasion_id: string | null;
                    name: string;
                    description: string | null;
                    price_min: number | null;
                    price_max: number | null;
                    url: string | null;
                    image_url: string | null;
                    category: string | null;
                    status: 'idea' | 'purchased' | 'given';
                    sentiment_score: number | null;
                    ai_reasoning: string | null;
                    embedding: number[] | null;
                    metadata: Record<string, unknown>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipient_id?: string | null;
                    occasion_id?: string | null;
                    name: string;
                    description?: string | null;
                    price_min?: number | null;
                    price_max?: number | null;
                    url?: string | null;
                    image_url?: string | null;
                    category?: string | null;
                    status?: 'idea' | 'purchased' | 'given';
                    sentiment_score?: number | null;
                    ai_reasoning?: string | null;
                    embedding?: number[] | null;
                    metadata?: Record<string, unknown>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    recipient_id?: string | null;
                    occasion_id?: string | null;
                    name?: string;
                    description?: string | null;
                    price_min?: number | null;
                    price_max?: number | null;
                    url?: string | null;
                    image_url?: string | null;
                    category?: string | null;
                    status?: 'idea' | 'purchased' | 'given';
                    sentiment_score?: number | null;
                    ai_reasoning?: string | null;
                    embedding?: number[] | null;
                    metadata?: Record<string, unknown>;
                    updated_at?: string;
                };
            };
            gift_trends: {
                Row: {
                    id: string;
                    category: string;
                    season: string | null;
                    trends: unknown[];
                    fetched_at: string;
                    expires_at: string | null;
                };
                Insert: {
                    id?: string;
                    category: string;
                    season?: string | null;
                    trends?: unknown[];
                    fetched_at?: string;
                    expires_at?: string | null;
                };
                Update: {
                    category?: string;
                    season?: string | null;
                    trends?: unknown[];
                    fetched_at?: string;
                    expires_at?: string | null;
                };
            };
        };
        Functions: {
            match_gifts: {
                Args: {
                    query_embedding: number[];
                    match_threshold?: number;
                    match_count?: number;
                };
                Returns: {
                    id: string;
                    name: string;
                    description: string | null;
                    category: string | null;
                    similarity: number;
                }[];
            };
            match_recipients: {
                Args: {
                    query_embedding: number[];
                    target_user_id: string;
                    match_count?: number;
                };
                Returns: {
                    id: string;
                    name: string;
                    relationship: string | null;
                    similarity: number;
                }[];
            };
        };
    };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Recipient = Database['public']['Tables']['recipients']['Row'];
export type RecipientInsert = Database['public']['Tables']['recipients']['Insert'];
export type RecipientUpdate = Database['public']['Tables']['recipients']['Update'];

export type Occasion = Database['public']['Tables']['occasions']['Row'];
export type OccasionInsert = Database['public']['Tables']['occasions']['Insert'];
export type OccasionUpdate = Database['public']['Tables']['occasions']['Update'];

export type GiftIdea = Database['public']['Tables']['gift_ideas']['Row'];
export type GiftIdeaInsert = Database['public']['Tables']['gift_ideas']['Insert'];
export type GiftIdeaUpdate = Database['public']['Tables']['gift_ideas']['Update'];

export type GiftTrend = Database['public']['Tables']['gift_trends']['Row'];

export type GiftStatus = 'idea' | 'purchased' | 'given';

export type RelationshipType =
    | 'friend'
    | 'parent'
    | 'sibling'
    | 'spouse'
    | 'child'
    | 'colleague'
    | 'boss'
    | 'grandparent'
    | 'cousin'
    | 'other';
