import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";

export function MemberProfile() {
    const { fetchProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchProfile();
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, [fetchProfile]);

    if (loading) return <div className="p-6">Loading profile...</div>;

    if (!profile) return <div className="p-6">Failed to load profile.</div>;

    return (
        <div className="max-w-2xl mx-auto">
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
