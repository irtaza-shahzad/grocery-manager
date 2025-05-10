// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products, orders, and users from backend
    fetch('http://localhost:3000/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data));

    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));

    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded mt-4">Logout</button>
      </header>

      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Products Section */}
        <section>
          <h2 className="text-2xl mb-4">Products</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ProductID}>
                  <td>{product.Name}</td>
                  <td>{product.CategoryName}</td>
                  <td>{product.Price}</td>
                  <td>{product.StockQuantity}</td>
                  <td>
                    <button className="bg-blue-500 text-white p-2 rounded">Edit</button>
                    <button className="bg-red-500 text-white p-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-2xl mb-4">Users</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UserID}>
                  <td>{user.Username}</td>
                  <td>{user.Email}</td>
                  <td>{user.Role}</td>
                  <td>
                    <button className="bg-yellow-500 text-white p-2 rounded">Edit</button>
                    <button className="bg-red-500 text-white p-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Orders Section */}
        <section>
          <h2 className="text-2xl mb-4">Orders</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td>{order.Username}</td>
                  <td>${order.TotalAmount}</td>
                  <td>{order.Status}</td>
                  <td>
                    <button className="bg-green-500 text-white p-2 rounded">Ship</button>
                    <button className="bg-blue-500 text-white p-2 rounded ml-2">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
