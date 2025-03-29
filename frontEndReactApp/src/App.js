import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Users from './pages/Users';
import Shops from './pages/Shops';
import Aisles from './pages/Aisles';
import Items from './pages/Items';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component for admin routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/chat" />;
  }

  return children;
};

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/chat" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/shops"
              element={
                <AdminRoute>
                  <Layout>
                    <Shops />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/aisles"
              element={
                <AdminRoute>
                  <Layout>
                    <Aisles />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/items"
              element={
                <AdminRoute>
                  <Layout>
                    <Items />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ChatPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
