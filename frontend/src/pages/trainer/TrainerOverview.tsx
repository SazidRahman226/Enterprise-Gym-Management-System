import { useAuth } from "../../context/AuthContext";
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";

export function TrainerOverview() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary-950">
                    Trainer Dashboard
                </h1>
                <div className="text-sm text-primary-700">
                    Welcome, {user?.name || 'Trainer'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Active Clients</p>
                            <p className="text-2xl font-semibold text-primary-950">8</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-50 text-green-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Sessions Today</p>
                            <p className="text-2xl font-semibold text-primary-950">4</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Hours This Week</p>
                            <p className="text-2xl font-semibold text-primary-950">24</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-700">Rating</p>
                            <p className="text-2xl font-semibold text-primary-950">4.9</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow border border-primary-200 p-6">
                    <h3 className="text-lg font-bold text-primary-950 mb-4">Upcoming Sessions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center font-bold text-primary-600">
                                        C{i}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-primary-950">Client Name {i}</p>
                                        <p className="text-sm text-primary-700">Personal Training • 10:00 AM</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-primary-100 text-primary-700 rounded">Confirmed</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-primary-200 p-6">
                    <h3 className="text-lg font-bold text-primary-950 mb-4">Pending Requests</h3>
                    <p className="text-primary-700 text-sm">No pending requests.</p>
                </div>
            </div>
        </div>
    );
}
