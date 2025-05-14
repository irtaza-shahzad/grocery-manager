// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/AdminProducts.jsx';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Dashboard from './pages/Dashboard'
import AdminOrders from './pages/AdminOrders.jsx';
import AdminRecipe from './pages/AdminRecipe.jsx';
import AllCarts from './components/AllCarts.jsx';
import AdminCart from './pages/AdminCart.jsx';
import AdminReviews from './pages/AdminReviews.jsx';
import AdminInsights from './pages/AdminInsights.jsx';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="Customer">
              { <Dashboard /> }
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="Admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="Admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recipies"
          element={
            <ProtectedRoute role="Admin">
              <AdminRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/carts"
          element={
            <ProtectedRoute role="Admin">
              <AdminCart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute role="Admin">
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/insights"
          element={
            <ProtectedRoute role="Admin">
              <AdminInsights />
            </ProtectedRoute>
          }
        />

        {/* Redirect to login by default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
