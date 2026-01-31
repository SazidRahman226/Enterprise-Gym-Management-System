import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Wrench, Trash2, Activity } from 'lucide-react';

interface Equipment {
    id: number;
    name: string;
    description: string;
    purchaseDate: string;
    status: string;
}

export function EquipmentManager() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEq, setNewEq] = useState({ name: '', description: '' });

    const fetchEquipment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/equipment', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEquipment(data);
            }
        } catch (error) {
            console.error('Error fetching equipment', error);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const handleAddEquipment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/equipment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: '', // Not used but might be required by model binding?
                    equipmentName: newEq.name,
                    description: newEq.description,
                    status: 'Active'
                })
            });

            if (response.ok) {
                setShowAddForm(false);
                setNewEq({ name: '', description: '' });
                fetchEquipment();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/equipment/${id}/status?status=${status}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchEquipment();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this equipment?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/equipment/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchEquipment();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary-900">Equipment Inventory</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddForm ? 'Cancel' : 'Add Equipment'}
                </Button>
            </div>

            {showAddForm && (
                <div className="bg-white p-4 rounded-lg shadow border border-primary-200">
                    <form onSubmit={handleAddEquipment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-primary-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm border py-2 px-3"
                                value={newEq.name}
                                onChange={e => setNewEq({ ...newEq, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-700">Description</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm border py-2 px-3"
                                value={newEq.description}
                                onChange={e => setNewEq({ ...newEq, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit">Save Equipment</Button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((eq) => (
                    <div key={eq.id} className="bg-white rounded-lg shadow border border-primary-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-primary-900">{eq.name}</h3>
                                <p className="text-sm text-primary-500">{eq.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${eq.status === 'Active' ? 'bg-green-100 text-green-800' :
                                eq.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {eq.status}
                            </span>
                        </div>

                        <div className="flex justify-between mt-4 pt-4 border-t border-primary-100">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(eq.id, 'Active')}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Set Active"
                                >
                                    <Activity className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(eq.id, 'Maintenance')}
                                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                    title="Set Maintenance"
                                >
                                    <Wrench className="h-4 w-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => handleDelete(eq.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
