// API Service Layer for Howl Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// Token management
const TOKEN_KEY = 'howl_access_token';
const REFRESH_TOKEN_KEY = 'howl_refresh_token';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string, remember: boolean = true): void => {
    if (remember) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

export const clearTokens = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

// API client with automatic token handling
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = getAccessToken();

        const headers: HeadersInit = {
            ...options.headers,
        };

        if (!(options.body instanceof FormData)) {
            (headers as Record<string, string>)['Content-Type'] = 'application/json';
        }

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 - try to refresh token
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry request with new token
                const newToken = getAccessToken();
                (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
                const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
                    ...options,
                    headers,
                });
                if (!retryResponse.ok) {
                    throw new Error(`API Error: ${retryResponse.status}`);
                }
                return retryResponse.json();
            } else {
                clearTokens();
                window.location.href = '/login';
                throw new Error('Session expired');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(error.detail || `API Error: ${response.status}`);
        }

        return response.json();
    }

    private async refreshToken(): Promise<boolean> {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setTokens(data.access_token, data.refresh_token);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // GET request
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    // POST request
    // POST request
    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        const isFormData = data instanceof FormData;
        return this.request<T>(endpoint, {
            method: 'POST',
            body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
        });
    }

    // PUT request
    // PUT request
    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        const isFormData = data instanceof FormData;
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
        });
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Create API client instance
const api = new ApiClient(API_BASE_URL);

// ============ AUTH API ============
export const authApi = {
    register: (email: string, password: string, displayName?: string) =>
        api.post<{ access_token: string; refresh_token: string }>('/api/auth/register', {
            email,
            password,
            display_name: displayName,
        }),

    login: (email: string, password: string) =>
        api.post<{ access_token: string; refresh_token: string }>('/api/auth/login', {
            email,
            password,
        }),



    logout: () => {
        clearTokens();
    },
};

// ============ USER API ============
export const userApi = {
    getProfile: () => api.get<UserProfile>('/api/users/me'),

    updateProfile: (data: Partial<UserProfile>) =>
        api.put<UserProfile>('/api/users/me', data),

    completeOnboarding: (data: OnboardingData) =>
        api.post<UserProfile>('/api/users/me/onboarding', data),

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = getAccessToken();
        const response = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload avatar');
        }

        return response.json() as Promise<UserProfile>;
    },

    getMyTrips: (status?: string) =>
        api.get<TripJournal>(`/api/users/me/trips${status ? `?status=${status}` : ''}`),
};

// ============ TRIPS API ============
export const tripsApi = {
    list: (params?: { search?: string; skip?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        const query = queryParams.toString();
        return api.get<TripListItem[]>(`/api/trips${query ? `?${query}` : ''}`);
    },

    getById: (id: string) => api.get<TripDetail>(`/api/trips/${id}`),

    create: (data: TripCreate) => api.post<TripDetail>('/api/trips', data),

    update: (id: string, data: Partial<TripCreate>) =>
        api.put<TripDetail>(`/api/trips/${id}`, data),

    delete: (id: string) => api.delete(`/api/trips/${id}`),

    join: (id: string) =>
        api.post<{ status: string; message: string }>(`/api/trips/${id}/join`),

    getJoinRequests: (id: string) =>
        api.get<JoinRequest[]>(`/api/trips/${id}/requests`),

    approveRequest: (tripId: string, requestId: string) =>
        api.post(`/api/trips/${tripId}/requests/${requestId}/approve`),

    rejectRequest: (tripId: string, requestId: string) =>
        api.post(`/api/trips/${tripId}/requests/${requestId}/reject`),

    getMembers: (id: string) => api.get<Member[]>(`/api/trips/${id}/members`),

    searchSimilar: (destination: string) =>
        api.get<SimilarTrip[]>(`/api/trips/search/similar?destination=${destination}`),
};

// ============ COMMON API ============
export const commonApi = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>('/api/upload', formData);
        return response;
    }
};

// ============ GROUPS API ============
export const groupsApi = {
    getMyGroups: () => api.get<Group[]>('/api/groups'),

    getGroupDetails: (id: string) => api.get<GroupDetails>(`/api/groups/${id}`),
};

// ============ MESSAGES API ============
export const messagesApi = {
    getHistory: (tripId: string, skip = 0, limit = 50) =>
        api.get<MessageList>(`/api/messages/trips/${tripId}?skip=${skip}&limit=${limit}`),

    send: (tripId: string, content: string) =>
        api.post<Message>(`/api/messages/trips/${tripId}`, { content }),
};

// ============ CALENDAR API ============
export const calendarApi = {
    getEvents: (month?: number, year?: number) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month.toString());
        if (year) params.append('year', year.toString());
        const query = params.toString();
        return api.get<CalendarEvent[]>(`/api/calendar/events${query ? `?${query}` : ''}`);
    },

    getTripsByMonth: (month: number, year = 2026) =>
        api.get<CalendarTrip[]>(`/api/calendar/trips-by-month?month=${month}&year=${year}`),
};

// ============ WEBSOCKET ============
export const createChatWebSocket = (tripId: string): WebSocket => {
    const token = getAccessToken();
    return new WebSocket(`${WS_BASE_URL}/ws/chat/${tripId}?token=${token}`);
};

// ============ TYPES ============
export interface UserProfile {
    id: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
    location?: string;
    bio?: string;
    age_range?: string;
    personality?: string;
    interests: string[];
    onboarding_completed: boolean;
    created_at: string;
}

export interface OnboardingData {
    display_name: string;
    age_range: string;
    location: string;
    personality: string;
    interests: string[];
}

export interface TripListItem {
    id: string;
    title: string;
    location: string;
    duration?: string;
    image_url?: string;
    date?: string;
    tags: string[];
    member_count: number;
    max_members: number;
    is_member: boolean;
}

export interface TripDetail {
    id: string;
    title: string;
    location: string;
    duration?: string;
    dates?: string;
    max_members: number;
    image_url?: string;
    description?: string;
    tags: string[];
    plans: TripPlan[];
    members: Member[];
    leader?: { name: string; avatar?: string };
    restrictions: {
        ageLimit: string;
        gender: string;
        vibe?: string;
        joinType: string;
    };
    member_count: number;
    is_member: boolean;
    is_leader: boolean;
    created_at: string;
}

export interface TripPlan {
    id: string;
    day_range: string;
    title: string;
    detail?: string;
    order: number;
}

export interface TripCreate {
    title: string;
    location: string;
    duration?: string;
    dates?: string;
    max_members?: number;
    image_url?: string;
    description?: string;
    age_limit?: string;
    gender?: string;
    vibe?: string;
    join_type?: string;
    tags?: string[];
    plans?: { day_range: string; title: string; detail?: string }[];
}

export interface Member {
    id: string;
    display_name?: string;
    avatar_url?: string;
    role: string;
}

export interface JoinRequest {
    id: string;
    user_id: string;
    user_name?: string;
    user_avatar?: string;
    status: string;
    created_at: string;
}

export interface SimilarTrip {
    id: string;
    title: string;
    location: string;
    date?: string;
    groupSize: string;
    restrictions: string;
    image?: string;
}

export interface Group {
    id: string;
    title: string;
    location: string;
    members: string;
    lastMessage: string;
    time: string;
    unread: number;
    image: string;
}

export interface GroupDetails {
    id: string;
    title: string;
    location: string;
    member_count: number;
    image?: string;
    created_at: string;
}

export interface Message {
    id: string;
    trip_id: string;
    sender_id: string;
    sender_name?: string;
    sender_avatar?: string;
    content: string;
    created_at: string;
    is_me: boolean;
}

export interface MessageList {
    messages: Message[];
    total: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    location: string;
    dates?: string;
    color: string;
    vibe?: string;
}

export interface CalendarTrip {
    id: string;
    title: string;
    location: string;
    dates: number[];
    month: number;
    color: string;
    vibe?: string;
}

export interface TripJournal {
    upcoming: TripListItem[];
    pending: TripListItem[];
    past: TripListItem[];
}

export default api;
