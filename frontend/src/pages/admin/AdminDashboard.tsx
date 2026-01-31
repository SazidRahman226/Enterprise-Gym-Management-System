import { useState } from 'react';
import { PendingRequests } from './components/PendingRequests';
import { FacilityManager } from './components/FacilityManager';
import { EquipmentManager } from './components/EquipmentManager';
import { AnalyticsReports } from './components/AnalyticsReports';
import { ClassScheduler } from './components/ClassScheduler';

type Tab = 'dashboard' | 'facilities' | 'equipment' | 'classes' | 'access';

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-primary-900">Admin Portal</h1>
                <p className="text-primary-600">Overview and Management</p>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-primary-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`${activeTab === 'dashboard'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Overview & Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('facilities')}
                        className={`${activeTab === 'facilities'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Facilities
                    </button>
                    <button
                        onClick={() => setActiveTab('equipment')}
                        className={`${activeTab === 'equipment'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`${activeTab === 'classes'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Class Scheduling
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        <PendingRequests />
                        <AnalyticsReports />
                    </div>
                )}
                {activeTab === 'facilities' && <FacilityManager />}
                {activeTab === 'equipment' && <EquipmentManager />}
                {activeTab === 'classes' && <ClassScheduler />}
            </div>
        </div>
    );
}
