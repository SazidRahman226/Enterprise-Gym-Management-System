import { CalendarDays } from "lucide-react";

export function MemberAttendance() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-primary-950">Attendance History</h1>

            <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-primary-50 p-4 rounded-full mb-4">
                    <CalendarDays className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-primary-900">No attendance records yet</h3>
                <p className="mt-2 text-sm text-primary-700 max-w-sm">
                    Your gym visits and class attendance will appear here once you start checking in.
                </p>
            </div>
        </div>
    );
}
