import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Calendar, TrendingUp } from "lucide-react";

export function MemberOverview() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary-950">
                    Welcome back, {user?.name}
                </h1>
                <Link to="/dashboard/member/purchase">
                    <Button>Upgrade Plan</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Total Workouts</p>
                            <p className="text-2xl font-semibold text-primary-950">12</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Next Class</p>
                            <p className="text-lg font-semibold text-primary-950">Yoga Flow</p>
                            <p className="text-xs text-primary-500">Tomorrow, 10:00 AM</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-primary-200">
                <div className="px-6 py-4 border-b border-primary-200">
                    <h3 className="text-lg font-medium text-primary-950">Recent Activity</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-primary-700">No recent activity found. Book your first class!</p>
                </div>
            </div>
        </div>
    );
}
