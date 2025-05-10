// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

console.log('UserDashboard component rendered');
  useEffect(() => { 

    const abc = async () => {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error('Failed to fetch products');
        return;
      }
      const data = await response.json();
      setProducts(data);
    }



    abc();

      console.log('Products fetched:', products);
    
  
  }, [products])
  


  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="user-dashboard-container">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-3xl">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded mt-4">Logout</button>
      </header>

      <section className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-2xl mb-4">Product Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.ProductID} className="border p-4 rounded">
                <h3>{product.Name}</h3>
                <p>{product.CategoryName}</p>
                <p>${product.Price}</p>
                <button className="bg-blue-500 text-white p-2 rounded mt-2">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl mb-4">Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.ProductID} className="border p-2 rounded mb-2">
                {item.Name} - ${item.Price} (Qty: {item.Quantity})
              </li>
            ))}
          </ul>
          <button className="bg-green-500 text-white p-2 rounded mt-4">Proceed to Checkout</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
