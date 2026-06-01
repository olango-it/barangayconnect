import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

// Public Layout
import PublicLayout from '@/components/public/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Officials from '@/pages/Officials';
import Services from '@/pages/Services';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Events from '@/pages/Events';
import Tourism from '@/pages/Tourism';
import TourismDetail from '@/pages/TourismDetail';
import Disaster from '@/pages/Disaster';
import Transparency from '@/pages/Transparency';
import Downloads from '@/pages/Downloads';
import Contact from '@/pages/Contact';
import Verify from '@/pages/Verify';
import Festival from '@/pages/Festival';
import ResidentPortal from '@/pages/ResidentPortal';

// Admin Gate
import AdminGate from '@/pages/AdminGate';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import ResidentManager from '@/pages/admin/ResidentManager';
import CertificateProcessor from '@/pages/admin/CertificateProcessor';
import RequestManager from '@/pages/admin/RequestManager';
import NewsManager from '@/pages/admin/NewsManager';
import EventManager from '@/pages/admin/EventManager';
import OfficialManager from '@/pages/admin/OfficialManager';
import DocumentManager from '@/pages/admin/DocumentManager';
import MessageManager from '@/pages/admin/MessageManager';
import StaffManager from '@/pages/admin/StaffManager';
import FAQManager from '@/pages/admin/FAQManager';
import KnowledgeBaseManager from '@/pages/admin/KnowledgeBaseManager';
import ChatDashboard from '@/pages/admin/ChatDashboard';
import SitePhotosManager from '@/pages/admin/SitePhotosManager';
import TourismManager from '@/pages/admin/TourismManager';
import FestivalManager from '@/pages/admin/FestivalManager';

// Auth Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/officials" element={<Officials />} />
        <Route path="/services" element={<Services />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/tourism/:id" element={<TourismDetail />} />
        <Route path="/disaster" element={<Disaster />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/festival" element={<Festival />} />
        <Route path="/resident-portal" element={<ResidentPortal />} />
      </Route>

      {/* Admin gate (PIN + login) */}
      <Route path="/admin" element={<AdminGate />} />

      {/* Admin panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="residents" element={<ResidentManager />} />
        <Route path="certificates" element={<CertificateProcessor />} />
        <Route path="requests" element={<RequestManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="events" element={<EventManager />} />
        <Route path="officials" element={<OfficialManager />} />
        <Route path="documents" element={<DocumentManager />} />
        <Route path="messages" element={<MessageManager />} />
        <Route path="staff" element={<StaffManager />} />
        <Route path="faq" element={<FAQManager />} />
        <Route path="knowledge-base" element={<KnowledgeBaseManager />} />
        <Route path="chat" element={<ChatDashboard />} />
        <Route path="photos" element={<SitePhotosManager />} />
        <Route path="tourism" element={<TourismManager />} />
        <Route path="festival" element={<FestivalManager />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App