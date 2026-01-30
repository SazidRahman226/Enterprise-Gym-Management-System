import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { CheckCircle, AlertCircle, CreditCard, User, Mail, Phone, Calendar, Heart, Edit2, X, Save } from "lucide-react";

export function MemberProfile() {
    const { fetchProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [pendingInvoice, setPendingInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: "",
        dob: "",
        emergencyContact: ""
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const loadProfileData = async () => {
            const data = await fetchProfile();
            setProfile(data);
            if (data) {
                setEditForm({
                    phone: data.phone || "",
                    dob: data.dob || "",
                    emergencyContact: data['emergency-contact'] || ""
                });
            }

            // Fetch subscription status
            const token = localStorage.getItem('token');
            try {
                const subResponse = await fetch('/api/subscriptions/current', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (subResponse.ok) {
                    const subData = await subResponse.json();
                    setSubscription(subData);
                }

                // Fetch pending invoices
                const invoiceResponse = await fetch('/api/subscriptions/invoices/pending', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (invoiceResponse.ok) {
                    const invoiceData = await invoiceResponse.json();
                    if (invoiceData && invoiceData.invoice_id) {
                        setPendingInvoice(invoiceData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch subscription info", error);
            }

            setLoading(false);
        };
        loadProfileData();
    }, [fetchProfile]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset form if canceling
            setEditForm({
                phone: profile.phone || "",
                dob: profile.dob || "",
                emergencyContact: profile['emergency-contact'] || ""
            });
        }
        setIsEditing(!isEditing);
        setSaveSuccess(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaveLoading(true);
        // Dummy save - wait 1 second then success
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProfile((prev: any) => ({
            ...prev,
            phone: editForm.phone,
            dob: editForm.dob,
            'emergency-contact': editForm.emergencyContact
        }));

        setSaveLoading(false);
        setSaveSuccess(true);
        setIsEditing(false);

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!profile) return (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load profile. Please try logging in again.</span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Save Success Toast */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-950">My Profile</h1>
                {saveSuccess && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Changes saved successfully!
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Subscription Status */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Subscription Status Card */}
                    <div className="bg-white shadow-sm rounded-2xl p-6 border border-primary-100 h-full overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard className="h-16 w-16" />
                        </div>
                        <h3 className="text-lg font-bold text-primary-950 mb-4">Membership</h3>

                        {subscription?.status === 'active' ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-block uppercase tracking-wider">
                                    Active
                                </div>
                                <div>
                                    <p className="text-sm text-primary-600">Current Plan</p>
                                    <p className="text-xl font-bold text-primary-950 capitalize">{subscription.plan}</p>
                                </div>
                                {subscription.expiresAt && (
                                    <div className="pt-2 border-t border-primary-50">
                                        <p className="text-xs text-primary-500 uppercase font-bold">Expires On</p>
                                        <p className="text-sm text-primary-900">{new Date(subscription.expiresAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        ) : pendingInvoice ? (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold inline-block uppercase tracking-wider">
                                    Pending Payment
                                </div>
                                <p className="text-sm text-primary-700">
                                    Complete payment to activate your <span className="font-bold">{pendingInvoice.plan}</span> plan.
                                </p>
                                <Link to="/dashboard/member/purchase" className="block">
                                    <Button size="sm" className="w-full">Pay Now</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold inline-block uppercase tracking-wider">
                                    No Plan
                                </div>
                                <p className="text-sm text-primary-600">
                                    Join us today and unlock all features.
                                </p>
                                <Link to="/dashboard/member/purchase" className="block">
                                    <Button size="sm" className="w-full">View Plans</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-2xl p-8 border border-primary-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-primary-950">Personal Details</h2>
                                    <p className="text-sm text-primary-500">Manage your account information</p>
                                </div>
                            </div>
                            <Button
                                variant={isEditing ? "outline" : "default"}
                                size="sm"
                                onClick={handleEditToggle}
                                className="flex items-center gap-2"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="h-4 w-4" /> Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4" /> Edit Profile
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                    <User className="h-4 w-4 text-primary-400" /> Full Name
                                </label>
                                <p className="p-3 bg-primary-50/50 rounded-xl text-primary-950 font-medium border border-primary-50">
                                    {profile.username || 'User'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                    <Mail className="h-4 w-4 text-primary-400" /> Email Address
                                </label>
                                <p className="p-3 bg-primary-50/50 rounded-xl text-primary-950 font-medium border border-primary-50">
                                    {profile.email || 'N/A'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                    <Phone className="h-4 w-4 text-primary-400" /> Phone Number
                                </label>
                                {isEditing ? (
                                    <Input
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="rounded-xl border-primary-200 focus:ring-primary-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-white rounded-xl text-primary-950 border border-primary-100">
                                        {profile.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                    <Calendar className="h-4 w-4 text-primary-400" /> Date of Birth
                                </label>
                                {isEditing ? (
                                    <Input
                                        name="dob"
                                        type="date"
                                        value={editForm.dob}
                                        onChange={handleInputChange}
                                        className="rounded-xl border-primary-200 focus:ring-primary-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-white rounded-xl text-primary-950 border border-primary-100">
                                        {profile.dob || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                    <Heart className="h-4 w-4 text-primary-400" /> Emergency Contact
                                </label>
                                {isEditing ? (
                                    <Input
                                        name="emergencyContact"
                                        value={editForm.emergencyContact}
                                        onChange={handleInputChange}
                                        placeholder="Name and phone number"
                                        className="rounded-xl border-primary-200 focus:ring-primary-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-white rounded-xl text-primary-950 border border-primary-100">
                                        {profile['emergency-contact'] || 'None listed'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-10 flex border-t border-primary-50 pt-8">
                                <Button
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="flex items-center gap-2 min-w-[140px]"
                                >
                                    {saveLoading ? (
                                        <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {saveLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
