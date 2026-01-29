import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dumbbell, AlertCircle, UserPlus } from "lucide-react";
import type { MemberRegisterData } from "../../context/AuthContext";

export function RegisterMember() {
    const [formData, setFormData] = useState<MemberRegisterData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        emergencyContact: "",
        dob: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const { registerMember, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        // Validate passwords match
        if (formData.password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setValidationError("Password must be at least 8 characters long");
            return;
        }

        // Validate date of birth
        if (!formData.dob) {
            setValidationError("Date of birth is required");
            return;
        }

        try {
            await registerMember(formData);
            navigate("/dashboard/member");
        } catch (err) {
            // Error is handled by AuthContext
        }
    };

    const displayError = validationError || error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full shadow-lg">
                            <UserPlus className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-extrabold text-primary-950">
                        Join FitMinds
                    </h2>
                    <p className="mt-2 text-sm text-primary-700">
                        Start your fitness journey today as a member
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-primary-100 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {displayError && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{displayError}</span>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary-950 mb-4 pb-2 border-b border-primary-100">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-primary-900 mb-2">
                                        First Name
                                    </label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-primary-900 mb-2">
                                        Last Name
                                    </label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-primary-900 mb-2">
                                        Date of Birth
                                    </label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        required
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary-950 mb-4 pb-2 border-b border-primary-100">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-primary-900 mb-2">
                                        Phone Number
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="+1-555-0199-8877"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-primary-900 mb-2">
                                        Emergency Contact
                                    </label>
                                    <Input
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        type="text"
                                        required
                                        placeholder="Jane Doe - 555-999-1122"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary-950 mb-4 pb-2 border-b border-primary-100">
                                Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-primary-900 mb-2">
                                        Password
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <p className="mt-1 text-xs text-primary-600">
                                        At least 8 characters
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-900 mb-2">
                                        Confirm Password
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Create Member Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-primary-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary-700 hover:text-primary-800 underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
