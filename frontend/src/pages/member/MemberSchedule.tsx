import { useState } from "react";
import { Clock, User, MapPin } from "lucide-react";

interface ClassActivity {
    id: string;
    name: string;
    trainer: string;
    room: string;
    time: string;
    duration: string;
    day: string;
    intensity: 'Low' | 'Medium' | 'High';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DUMMY_SCHEDULE: ClassActivity[] = [
    { id: '1', name: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio B', time: '07:00 AM', duration: '60 min', day: 'Monday', intensity: 'Low' },
    { id: '2', name: 'HIIT Blast', trainer: 'Mike Ross', room: 'Main Floor', time: '09:00 AM', duration: '45 min', day: 'Monday', intensity: 'High' },
    { id: '3', name: 'Zumba Dance', trainer: 'Elena Rodriguez', room: 'Studio A', time: '05:30 PM', duration: '60 min', day: 'Tuesday', intensity: 'Medium' },
    { id: '4', name: 'Power Lifting', trainer: 'David Chen', room: 'Weight Area', time: '06:00 PM', duration: '90 min', day: 'Wednesday', intensity: 'High' },
    { id: '5', name: 'Pilates Flow', trainer: 'Sarah Johnson', room: 'Studio B', time: '08:00 AM', duration: '60 min', day: 'Thursday', intensity: 'Medium' },
    { id: '6', name: 'Spin Class', trainer: 'Chris Taylor', room: 'Cycle Studio', time: '06:30 PM', duration: '45 min', day: 'Friday', intensity: 'High' },
    { id: '7', name: 'Weekend Warrior', trainer: 'Mike Ross', room: 'Main Floor', time: '10:00 AM', duration: '75 min', day: 'Saturday', intensity: 'High' },
];

export function MemberSchedule() {
    const [selectedDay, setSelectedDay] = useState('Monday');

    const filteredClasses = DUMMY_SCHEDULE.filter(c => c.day === selectedDay);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-primary-950">Class Schedule</h1>
                <p className="mt-2 text-primary-600">Plan your week and join our group activities</p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {DAYS.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedDay === day
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'bg-white text-primary-600 border border-primary-100 hover:bg-primary-50'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.intensity === 'High' ? 'bg-red-50 text-red-600' :
                                    item.intensity === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                    {item.intensity} Intensity
                                </span>
                                <span className="text-sm font-bold text-primary-400 group-hover:text-primary-600 transition-colors">
                                    {item.duration}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-primary-950 mb-4">{item.name}</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-primary-700">
                                    <div className="p-1.5 bg-primary-50 rounded text-primary-500">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{item.time}</span>
                                </div>

                                <div className="flex items-center gap-3 text-primary-700">
                                    <div className="p-1.5 bg-primary-50 rounded text-primary-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{item.trainer}</span>
                                </div>

                                <div className="flex items-center gap-3 text-primary-700">
                                    <div className="p-1.5 bg-primary-50 rounded text-primary-500">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{item.room}</span>
                                </div>
                            </div>

                            <button className="mt-6 w-full py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-bold hover:bg-primary-600 hover:text-white transition-all uppercase tracking-wide">
                                Join Class
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-primary-50/50 border border-dashed border-primary-200 rounded-2xl p-12 text-center">
                        <p className="text-primary-500 font-medium">No classes scheduled for {selectedDay}</p>
                    </div>
                )}
            </div>

            {/* Tips/Info Section */}
            <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h3 className="text-2xl font-bold mb-2">Want a personalized plan?</h3>
                    <p className="text-primary-100 mb-6">Talk to our fitness experts to create a schedule that matches your specific goals and lifestyle.</p>
                    <button className="px-6 py-2 bg-white text-primary-900 rounded-full font-bold hover:bg-primary-50 transition-colors">
                        Book Consultation
                    </button>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary-800 to-transparent opacity-50" />
            </div>
        </div>
    );
}
