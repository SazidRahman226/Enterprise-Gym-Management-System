import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dumbbell, AlertCircle, Briefcase } from "lucide-react";
import type { TrainerRegisterData } from "../../context/AuthContext";

export function RegisterTrainer() {
    const [formData, setFormData] = useState<TrainerRegisterData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        specialization: "",
        shortDescription: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const { registerTrainer, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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

        // Validate description length
        if (formData.shortDescription.length < 20) {
            setValidationError("Description should be at least 20 characters");
            return;
        }

        try {
            await registerTrainer(formData);
            navigate("/dashboard/trainer");
        } catch (err) {
            // Error is handled by AuthContext
        }
    };

    const displayError = validationError || error;
    const descriptionLength = formData.shortDescription.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full shadow-lg">
                            <Briefcase className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-extrabold text-primary-950">
                        Join Our Team
                    </h2>
                    <p className="mt-2 text-sm text-primary-700">
                        Apply to become a trainer at FitMinds
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
                                        placeholder="Alex"
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
                                        placeholder="Rivers"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="alex.rivers@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary-950 mb-4 pb-2 border-b border-primary-100">
                                Professional Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="specialization" className="block text-sm font-medium text-primary-900 mb-2">
                                        Specialization
                                    </label>
                                    <Input
                                        id="specialization"
                                        name="specialization"
                                        type="text"
                                        required
                                        placeholder="e.g., Strength Training, Yoga, CrossFit"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    />
                                    <p className="mt-1 text-xs text-primary-600">
                                        What is your area of expertise?
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="shortDescription" className="block text-sm font-medium text-primary-900 mb-2">
                                        Short Description
                                    </label>
                                    <textarea
                                        id="shortDescription"
                                        name="shortDescription"
                                        rows={4}
                                        required
                                        className="flex w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Describe your experience, certifications, and approach to training..."
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                    />
                                    <p className="mt-1 text-xs text-primary-600">
                                        {descriptionLength} characters (minimum 20)
                                    </p>
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
                            {isLoading ? "Submitting Application..." : "Submit Trainer Application"}
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
