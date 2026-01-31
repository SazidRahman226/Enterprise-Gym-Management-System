import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Check, X } from 'lucide-react';

interface PendingTrainer {
    trainerId: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    shortDescription: string;
    status: string;
}

export function PendingRequests() {
    const [pendingTrainers, setPendingTrainers] = useState<PendingTrainer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/pending-trainers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending trainers');
            }

            const data = await response.json();
            setPendingTrainers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTrainers();
    }, []);

    const handleAction = async (trainerId: string, action: 'approve' | 'reject') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/pending-trainers/${action}/${trainerId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} trainer`);
            }

            // Refresh list
            fetchPendingTrainers();

        } catch (err: any) {
            alert(err.message);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-primary-600">Loading requests...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-primary-200">
                <h3 className="text-lg font-medium leading-6 text-primary-900">
                    Pending Trainer Requests ({pendingTrainers.length})
                </h3>
            </div>

            {pendingTrainers.length === 0 ? (
                <div className="p-6 text-center text-primary-500">
                    No pending trainer requests found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-primary-200">
                        <thead className="bg-primary-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Specialization</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-primary-200">
                            {pendingTrainers.map((trainer) => (
                                <tr key={trainer.trainerId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-primary-900">
                                            {trainer.firstName} {trainer.lastName}
                                        </div>
                                        <div className="text-sm text-primary-500">{trainer.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-primary-900">{trainer.specialization}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            {trainer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary-500 truncate max-w-xs">
                                        {trainer.shortDescription}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleAction(trainer.trainerId, 'approve')}
                                            >
                                                <Check className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => handleAction(trainer.trainerId, 'reject')}
                                            >
                                                <X className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
