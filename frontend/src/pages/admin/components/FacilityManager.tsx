import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface FacilityRoom {
    id: number;
    roomName: string;
    capacity: number;
}

export function FacilityManager() {
    const [rooms, setRooms] = useState<FacilityRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRoom, setNewRoom] = useState({ roomName: '', capacity: '' });

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/facilities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            }
        } catch (error) {
            console.error('Failed to fetch rooms', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/facilities', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomName: newRoom.roomName,
                    capacity: parseInt(newRoom.capacity)
                })
            });

            if (response.ok) {
                setShowAddForm(false);
                setNewRoom({ roomName: '', capacity: '' });
                fetchRooms();
            } else {
                alert('Failed to add room');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRoom = async (id: number) => {
        if (!confirm('Are you sure you want to delete this room?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/facilities/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchRooms();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div>Loading facilities...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary-900">Facility Management</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddForm ? 'Cancel' : 'Add Room'}
                </Button>
            </div>

            {showAddForm && (
                <div className="bg-white p-4 rounded-lg shadow border border-primary-200">
                    <form onSubmit={handleAddRoom} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-primary-700">Room Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3 border"
                                value={newRoom.roomName}
                                onChange={e => setNewRoom({ ...newRoom, roomName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium text-primary-700">Capacity</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3 border"
                                value={newRoom.capacity}
                                onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-primary-200">
                    <thead className="bg-primary-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase">Room Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase">Capacity</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-200">
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">{room.roomName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">{room.capacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
