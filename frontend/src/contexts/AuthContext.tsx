import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
    authApi,
    userApi,
    getAccessToken,
    setTokens,
    clearTokens,
    type UserProfile,
    type OnboardingData
} from '../services/api';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
    logout: () => void;
    googleLogin: () => void;
    completeOnboarding: (data: OnboardingData) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    refreshUser: () => Promise<void>;
    uploadAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = getAccessToken();
            if (token) {
                try {
                    const profile = await userApi.getProfile();
                    setUser(profile);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    clearTokens();
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    // Handle OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        if (accessToken && refreshToken) {
            setTokens(accessToken, refreshToken);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Load user
            userApi.getProfile().then(setUser).catch(console.error);
        }
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await authApi.login(email, password);
        setTokens(response.access_token, response.refresh_token);
        const profile = await userApi.getProfile();
        setUser(profile);
    };

    const register = async (email: string, password: string, displayName?: string): Promise<void> => {
        const response = await authApi.register(email, password, displayName);
        setTokens(response.access_token, response.refresh_token);
        const profile = await userApi.getProfile();
        setUser(profile);
    };

    const logout = (): void => {
        authApi.logout();
        setUser(null);
    };

    const googleLogin = (): void => {
        authApi.googleLogin();
    };

    const completeOnboarding = async (data: OnboardingData): Promise<void> => {
        const updatedUser = await userApi.completeOnboarding(data);
        setUser(updatedUser);
    };

    const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
        const updatedUser = await userApi.updateProfile(data);
        setUser(updatedUser);
    };

    const uploadAvatar = async (file: File): Promise<void> => {
        const updatedUser = await userApi.uploadAvatar(file);
        setUser(updatedUser);
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const profile = await userApi.getProfile();
            setUser(profile);
        } catch {
            // Silently fail
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        googleLogin,
        completeOnboarding,
        updateProfile,
        refreshUser,
        uploadAvatar
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
