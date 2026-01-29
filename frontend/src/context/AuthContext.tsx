import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
    email: string;
    role: 'member' | 'admin' | 'trainer' | 'staff';
    name?: string;
}

export interface MemberRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    emergencyContact: string;
    dob: string; // YYYY-MM-DD
}

export interface TrainerRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    specialization: string;
    shortDescription: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    registerMember: (data: MemberRegisterData) => Promise<void>;
    registerTrainer: (data: TrainerRegisterData) => Promise<void>;
    logout: () => void;
    fetchProfile: () => Promise<any>;
    updateProfile: (data: any) => Promise<any>;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Attempting login to /api/auth/login", { email });
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            console.log("Login response status:", response.status);

            if (!response.ok) {
                let errorMessage = 'Login failed. Please check your credentials.';
                try {
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        if (errorJson.message) errorMessage = errorJson.message;
                        else if (typeof errorJson === 'string') errorMessage = errorJson;
                    } catch {
                        if (errorText) errorMessage = errorText;
                    }
                } catch (e) {
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const token = data.token;
            const role = data.role;

            localStorage.setItem('token', token);

            const user: User = {
                email,
                role: role as 'member' | 'admin' | 'trainer' | 'staff'
            };

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerMember = async (data: MemberRegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register/member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed. Please check if your email or phone number is already registered.';
                try {
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        if (errorJson.message) errorMessage = errorJson.message;
                        else if (errorJson.error) errorMessage = errorJson.error;
                    } catch {
                        if (errorText) errorMessage = errorText;
                    }
                } catch (e) {
                }
                throw new Error(errorMessage);
            }

            const resData = await response.json();
            const token = resData.token;
            localStorage.setItem('token', token);
            localStorage.removeItem('pending_invoice'); // Clear stale invoices

            const user: User = {
                email: data.email,
                role: 'member'
            };

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerTrainer = async (data: TrainerRegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register/trainer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed. Please check if your email is already registered.';
                try {
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        if (errorJson.message) errorMessage = errorJson.message;
                        else if (errorJson.error) errorMessage = errorJson.error;
                    } catch {
                        if (errorText) errorMessage = errorText;
                    }
                } catch (e) {
                }
                throw new Error(errorMessage);
            }

            const resData = await response.json();
            const token = resData.token;
            localStorage.setItem('token', token);

            const user: User = {
                email: data.email,
                role: 'trainer'
            };

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const response = await fetch('/api/auth/userdetails', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
        return null;
    };

    const updateProfile = async (data: any) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token");

        const response = await fetch('/api/auth/userdetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return await response.json();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('pending_invoice');
    };

    return (
        <AuthContext.Provider value={{ user, login, registerMember, registerTrainer, logout, fetchProfile, updateProfile, isAuthenticated: !!user, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}