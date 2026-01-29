import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dumbbell, AlertCircle } from "lucide-react";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email.trim(), password.trim());
            // We need to read the user role to redirect correctly.
            // Since state update is async, we can check localStorage directly for immediate redirect
            // OR rely on AuthContext.user effect.
            // Let's use a timeout to allow state to settle or check localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role === 'admin') navigate('/dashboard/admin');
                else if (user.role === 'trainer') navigate('/dashboard/trainer');
                else navigate('/dashboard/member');
            } else {
                navigate('/dashboard/member'); // Default fallback
            }
        } catch (err) {
            // Error handled in context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-primary-100">
                <div className="text-center">
                    <div className="flex justify-center">
                        <Dumbbell className="h-12 w-12 text-primary-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-primary-950">
                        Sign in
                    </h2>
                    <p className="mt-2 text-sm text-primary-700">
                        Enter your email and password to access your account.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {authError && (
                        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {authError}
                        </div>
                    )}

                    <div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </div>

                    <div className="text-center mt-4 text-sm">
                        <Link to="/register-member" className="text-primary-600 hover:underline mr-4">Register as Member</Link>
                        <Link to="/register-trainer" className="text-primary-600 hover:underline">Apply as Trainer</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
