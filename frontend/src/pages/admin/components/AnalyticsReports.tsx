import { useState, useEffect } from 'react';

interface ChurnRiskMember {
    memberId: number;
    firstName: string;
    lastName: string;
    email: string;
    daysSinceLastVisit: string;
}

interface TrainerPerformance {
    trainerName: string;
    classesAssigned: number;
    performanceScore: number;
}

interface AdminStats {
    totalMembers: number;
    activeTrainers: number;
    occupancyRate: number;
    monthlyRevenue: number;
}

export function AnalyticsReports() {
    const [churnRisk, setChurnRisk] = useState<ChurnRiskMember[]>([]);
    const [performance, setPerformance] = useState<TrainerPerformance[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [riskRes, perfRes, statsRes] = await Promise.all([
                    fetch('/api/reports/churn-risk', { headers }),
                    fetch('/api/reports/trainer-performance', { headers }),
                    fetch('/api/dashboard/admin-stats', { headers })
                ]);

                if (riskRes.ok) setChurnRisk(await riskRes.json());
                if (perfRes.ok) setPerformance(await perfRes.json());
                if (statsRes.ok) setStats(await statsRes.json());

            } catch (error) {
                console.error("Error loading reports", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div className="space-y-8">
            {/* High Level Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
                        <div className="text-sm text-primary-500">Total Members</div>
                        <div className="text-2xl font-bold text-primary-900">{stats.totalMembers}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
                        <div className="text-sm text-primary-500">Active Trainers</div>
                        <div className="text-2xl font-bold text-primary-900">{stats.activeTrainers}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
                        <div className="text-sm text-primary-500">Occupancy Rate</div>
                        <div className="text-2xl font-bold text-primary-900">{(stats.occupancyRate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
                        <div className="text-sm text-primary-500">Est. Revenue</div>
                        <div className="text-2xl font-bold text-primary-900">${stats.monthlyRevenue}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Churn Risk Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">At-Risk Members (Churn)</h3>
                        <p className="text-sm text-gray-500">Members absent for 30+ days</p>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {churnRisk.map((m) => (
                                    <tr key={m.memberId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{m.firstName} {m.lastName}</div>
                                            <div className="text-xs text-gray-500">{m.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                            {m.daysSinceLastVisit} days
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trainer Performance */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Trainer Performance</h3>
                        <p className="text-sm text-gray-500">Based on class load and commission</p>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {performance.map((p, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.trainerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.classesAssigned}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{p.performanceScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
