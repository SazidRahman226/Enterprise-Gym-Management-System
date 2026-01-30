import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterMember } from './pages/auth/RegisterMember';
import { RegisterTrainer } from './pages/auth/RegisterTrainer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MemberOverview } from './pages/member/MemberOverview';
import { MemberProfile } from './pages/member/MemberProfile';
import { MemberAttendance } from './pages/member/MemberAttendance';
import { PurchasePlan } from './pages/member/PurchasePlan';
import { MemberSchedule } from './pages/member/MemberSchedule';
import { TrainerOverview } from './pages/trainer/TrainerOverview';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-member" element={<RegisterMember />} />
        <Route path="/register-trainer" element={<RegisterTrainer />} />
      </Route>

      {/* Member Routes */}
      <Route element={<ProtectedRoute allowedRoles={['member']} />}>
        <Route path="/dashboard" element={<DashboardLayout role="member" />}>
          <Route path="member" element={<MemberOverview />} />
          <Route path="member/profile" element={<MemberProfile />} />
          <Route path="member/attendance" element={<MemberAttendance />} />
          <Route path="member/purchase" element={<PurchasePlan />} />
          <Route path="member/schedule" element={<MemberSchedule />} />
        </Route>
      </Route>

      {/* Trainer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
        <Route path="/dashboard" element={<DashboardLayout role="trainer" />}>
          <Route path="trainer" element={<TrainerOverview />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;