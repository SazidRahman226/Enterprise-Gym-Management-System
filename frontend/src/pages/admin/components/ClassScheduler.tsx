import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';



interface Room {
    id: number;
    roomName: string;
}

export function ClassScheduler() {

    const [rooms, setRooms] = useState<Room[]>([]);

    // Form State
    const [className, setClassName] = useState('');
    const [trainerId, setTrainerId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('20');
    const [price, setPrice] = useState('0');

    useEffect(() => {
        // Fetch trainers and rooms for dropdowns
        const loadDependencies = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // In a real app we'd have dedicated endpoints for list selection
            // For now we assume we can fetch all rooms
            const roomRes = await fetch('/api/facilities', { headers });
            if (roomRes.ok) setRooms(await roomRes.json());

            // Fetch hired trainers - reusing the report endpoint logic or similar
            // If no direct list endpoint, we might need to adjust. 
            // IMPORTANT: The backend map shows no simple "get all trainers" endpoint except potentially via staff/admin.
            // We'll skip trainer fetching for now or assume user enters ID manually if API is missing.
            // EDIT: Checking controller... StaffController has pending checks but maybe not active list.
            // Let's rely on standard inputs if list missing, or mock it empty.
        };
        loadDependencies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/classes/schedule', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    className,
                    trainerId: parseInt(trainerId), // CAUTION: Input must be ID
                    roomId: parseInt(roomId),
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                    maxCapacity: parseInt(maxCapacity),
                    price: parseFloat(price)
                })
            });

            if (response.ok) {
                alert('Class scheduled successfully!');
                // Reset form
                setClassName('');
                setStartTime('');
                setEndTime('');
            } else {
                alert('Failed to schedule class');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border border-primary-200">
            <h2 className="text-xl font-bold mb-6">Schedule New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Class Name</label>
                    <input type="text" required value={className} onChange={e => setClassName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trainer ID</label>
                        <input type="number" required value={trainerId} onChange={e => setTrainerId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="ID" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room</label>
                        <select required value={roomId} onChange={e => setRoomId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                            <option value="">Select Room</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="datetime-local" required value={startTime} onChange={e => setStartTime(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="datetime-local" required value={endTime} onChange={e => setEndTime(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input type="number" required value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" required value={price} onChange={e => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </div>

                <Button type="submit" className="w-full">Schedule Class</Button>
            </form>
        </div>
    );
}
