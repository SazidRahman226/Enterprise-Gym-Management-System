import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Dumbbell, AlertCircle } from "lucide-react";

export function RegisterMember() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        emergencyContact: "",
        dob: ""
    });

    const { registerMember, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const trimmedData = {
                ...formData,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                phone: formData.phone.trim(),
                emergencyContact: formData.emergencyContact.trim(),
            };
            await registerMember(trimmedData);
            navigate('/dashboard/member');
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
                        Become a Member
                    </h2>
                    <p className="mt-2 text-sm text-primary-700">
                        Start your fitness journey today.
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="firstName" placeholder="First Name" required onChange={handleChange} />
                        <Input name="lastName" placeholder="Last Name" required onChange={handleChange} />
                    </div>
                    <Input name="email" type="email" placeholder="Email" required onChange={handleChange} />
                    <Input name="password" type="password" placeholder="Password" required onChange={handleChange} />
                    <Input name="phone" placeholder="Phone Number" required onChange={handleChange} />
                    <Input name="emergencyContact" placeholder="Emergency Contact (Optional)" onChange={handleChange} />
                    <div>
                        <label className="block text-sm font-medium text-primary-900 mb-1">Date of Birth</label>
                        <Input name="dob" type="date" required onChange={handleChange} />
                    </div>

                    {authError && (
                        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {authError}
                        </div>
                    )}

                    <div>
                        <Button type="submit" className="w-full">Register</Button>
                    </div>

                    <div className="text-center mt-4 text-sm">
                        <Link to="/login" className="text-primary-600 hover:underline">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
