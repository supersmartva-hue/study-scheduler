import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { store } from './store';
import { fetchCurrentUser } from './store/authSlice';
import { fetchSubjects } from './store/subjectsSlice';
import { ProtectedRoute, PublicRoute } from './routes';

import AppShell  from './components/layout/AppShell';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects  from './pages/Subjects';
import Schedule  from './pages/Schedule';
import Progress  from './pages/Progress';
import Settings  from './pages/Settings';

function AppInit({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
      dispatch(fetchSubjects());
    }
  }, [dispatch]);
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInit>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects"  element={<Subjects />} />
              <Route path="/schedule"  element={<Schedule />} />
              <Route path="/progress"  element={<Progress />} />
              <Route path="/settings"  element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppInit>
      </BrowserRouter>
    </Provider>
  );
}
