import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";

export function MemberProfile() {
    const { fetchProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [pendingInvoice, setPendingInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfileData = async () => {
            const data = await fetchProfile();
            setProfile(data);

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

    if (loading) return <div className="p-6">Loading profile...</div>;

    if (!profile) return <div className="p-6">Failed to load profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Subscription Status Card */}
            {subscription?.status === 'active' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-900">Active Subscription</h3>
                            <p className="mt-1 text-green-700">
                                You have an active <span className="font-semibold">{subscription.plan}</span> plan.
                            </p>
                            {subscription.expiresAt && (
                                <p className="mt-1 text-sm text-green-600">
                                    Expires on: {new Date(subscription.expiresAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Invoice Card */}
            {pendingInvoice && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900">Pending Payment</h3>
                                <p className="mt-1 text-yellow-700">
                                    You have a pending invoice. Complete your payment to activate your subscription.
                                </p>
                                <p className="text-sm text-yellow-600 mt-1">
                                    Invoice ID: {pendingInvoice.invoice_id}
                                </p>
                            </div>
                        </div>
                        <Link to="/dashboard/member/purchase">
                            <Button size="sm" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Pay Now
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* No Subscription Card */}
            {!subscription && !pendingInvoice && (
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-primary-900">No Active Subscription</h3>
                            <p className="mt-1 text-primary-700">
                                Purchase a subscription plan to unlock all features.
                            </p>
                        </div>
                        <Link to="/dashboard/member/purchase">
                            <Button size="sm">View Plans</Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Profile Information Card */}
            <div className="bg-white shadow rounded-lg p-6 border border-primary-200">
                <h2 className="text-2xl font-bold text-primary-950 mb-6">My Profile</h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-primary-900">Name</label>
                            <Input value={profile.username || ''} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-900">Email</label>
                            <Input value={profile.email || ''} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-900">Phone</label>
                            <Input value={profile.phone || ''} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-900">Date of Birth</label>
                            <Input value={profile.dob || ''} disabled />
                        </div>
                        {profile['emergency-contact'] && (
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-primary-900">Emergency Contact</label>
                                <Input value={profile['emergency-contact']} disabled />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
