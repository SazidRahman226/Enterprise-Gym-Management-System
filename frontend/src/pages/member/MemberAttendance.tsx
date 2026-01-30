import { CalendarDays, CheckCircle, Clock, MapPin } from "lucide-react";

interface AttendanceRecord {
    id: string;
    date: string;
    checkIn: string;
    checkOut: string;
    type: 'Gym Session' | 'Group Class';
    location: string;
}

const DUMMY_ATTENDANCE: AttendanceRecord[] = [
    { id: '1', date: '2026-01-28', checkIn: '08:15 AM', checkOut: '09:45 AM', type: 'Gym Session', location: 'Main Floor' },
    { id: '2', date: '2026-01-26', checkIn: '05:30 PM', checkOut: '06:30 PM', type: 'Group Class', location: 'Studio A' },
    { id: '3', date: '2026-01-25', checkIn: '07:00 AM', checkOut: '08:30 AM', type: 'Gym Session', location: 'Main Floor' },
    { id: '4', date: '2026-01-23', checkIn: '06:15 PM', checkOut: '07:45 PM', type: 'Gym Session', location: 'Main Floor' },
    { id: '5', date: '2026-01-21', checkIn: '12:00 PM', checkOut: '01:00 PM', type: 'Group Class', location: 'Studio B' },
];

export function MemberAttendance() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-primary-950">Attendance History</h1>
                <p className="mt-2 text-primary-600">Track your gym visits and class participation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
                    <p className="text-sm font-bold text-primary-500 uppercase tracking-wider">Total Visits</p>
                    <p className="text-3xl font-bold text-primary-950 mt-2">{DUMMY_ATTENDANCE.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
                    <p className="text-sm font-bold text-primary-500 uppercase tracking-wider">This Week</p>
                    <p className="text-3xl font-bold text-primary-950 mt-2">3</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
                    <p className="text-sm font-bold text-primary-500 uppercase tracking-wider">Average Duration</p>
                    <p className="text-3xl font-bold text-primary-950 mt-2">78 min</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary-50/50">
                                <th className="px-6 py-4 text-sm font-bold text-primary-900 border-b border-primary-100">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-primary-900 border-b border-primary-100">Type</th>
                                <th className="px-6 py-4 text-sm font-bold text-primary-900 border-b border-primary-100">Check In</th>
                                <th className="px-6 py-4 text-sm font-bold text-primary-900 border-b border-primary-100">Check Out</th>
                                <th className="px-6 py-4 text-sm font-bold text-primary-900 border-b border-primary-100">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-50">
                            {DUMMY_ATTENDANCE.map((record) => (
                                <tr key={record.id} className="hover:bg-primary-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                                                <CalendarDays className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-primary-950">
                                                {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.type === 'Group Class' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-primary-700">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-primary-400" />
                                            {record.checkIn}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-primary-700">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                                            {record.checkOut}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-primary-700">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-primary-400" />
                                            {record.location}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
