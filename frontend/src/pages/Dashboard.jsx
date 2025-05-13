import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenPayload } from '../utils/auth'; // Assuming the path to your auth utility is correct
import Button from '../components/Button'; // Correct path to Button component

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();

  const payload = getTokenPayload();
  const userId = payload.id; // user ID is stored in the token payload

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = 'http://localhost:3000/api/products';

        if (selectedCategory) {
          url = `http://localhost:3000/api/products/category/${selectedCategory}`;
        }
        else if (minPrice !== '' && maxPrice !== '') {
          url = `http://localhost:3000/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`;
        }
        else if (searchTerm) {
          url = `http://localhost:3000/api/products/search?term=${searchTerm}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch products');
          return;
        }

        const data = await response.json();
        setProducts(data);

        if (!selectedCategory && !searchTerm && !minPrice) {
          const uniqueCategories = [
            ...new Set(data.map((item) => item.CategoryName)),
          ];
          setCategories(uniqueCategories);
        }

      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchTerm]);

  // Fetch cart when the page loads
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
        if (!response.ok) {
          console.error('Failed to fetch cart');
          return;
        }
        const cartData = await response.json();
        setCart(cartData);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    if (userId) {
      fetchCart(); // Fetch the user's cart as soon as the component mounts
    }
  }, [userId]); // Ensure it's triggered when the component mounts or userId changes

  // Fetch favorites when the page loads
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/favorites/${userId}`);
        if (!response.ok) {
          console.error('Failed to fetch favorites');
          return;
        }
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    if (userId) {
      fetchFavorites(); // Fetch the user's favorites as soon as the component mounts
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Function to fetch cart (now defined outside useEffect)
  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
      if (!response.ok) {
        console.error('Failed to fetch cart');
        return;
      }
      const cartData = await response.json();
      setCart(cartData); // Update cart state with fetched data
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Function to add item to cart
  const addToCart = async (productId) => {
    try {
      const quantity = 1; // You can customize this, based on user input or defaults

      // Optimistically add the item to the local cart state
      const product = products.find((product) => product.ProductID === productId);
      const updatedCart = [
        ...cart,
        { ...product, Quantity: quantity, ProductID: product.ProductID },
      ];
      setCart(updatedCart); // Update local state immediately

      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        setNotification('Item successfully added to cart');
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false); // Hide the notification after 2 seconds
        }, 2000);

        fetchCart(); // Refresh cart after adding the item
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${productId}/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart((prevCart) => prevCart.filter((item) => item.ProductID !== productId));
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  // Function to determine stock status color
  const getStockStatusClass = (stockQuantity) => {
    if (stockQuantity > 0) {
      return 'text-green-500'; // In Stock (Green)
    }
    return 'text-red-500'; // Out of Stock (Red)
  };

  // Function to open the cart modal
  const openCartModal = () => {
    setShowCartModal(true);
  };

  // Function to close the cart modal
  const closeCartModal = () => {
    setShowCartModal(false);
  };

  // Function to clear cart
  const clearCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/clear/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart([]); // Clear the local cart state
      } else {
        console.error('Failed to clear cart');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  // Function to add to favorites
  const addFavorite = async (productId) => {
    try {
      const product = products.find((product) => product.ProductID === productId);

      console.log('Adding to favorites:', product);
      console.log('User ID:', userId);
      await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
        }),
      });
      setFavorites((prevFavorites) => [...prevFavorites, product]); // Update local favorites state
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  // Function to remove from favorites
  const removeFavorite = async (productId) => {
    try {
      await fetch(`http://localhost:3000/api/favorites/${productId}/${userId}`, {
        method: 'DELETE',
      });
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.ProductID !== productId)); // Update local favorites state
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  // Function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((item) => item.ProductID === productId);
  };

  // Function to handle favorite toggle
  const handleFavorite = (productId) => {
    const isFavorited = isFavorite(productId);
    if (isFavorited) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  return (
    <div className="user-dashboard-container min-h-screen bg-gray-100">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-3xl">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <main className="p-4">
        {/* FILTER SECTION */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            className="p-2 border rounded"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="bg-gray-700 text-white p-2 rounded"
            onClick={() => {
              setSelectedCategory('');
              setMinPrice('');
              setMaxPrice('');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* PRODUCT LISTING */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.ProductID} className="border p-4 rounded bg-white shadow relative">
              <button
                onClick={() => handleFavorite(product.ProductID)}
                className={`absolute top-2 right-2 p-2 border-2 border-black rounded-full ${isFavorite(product.ProductID) ? 'text-red-500' : 'text-transparent'}`}
              >
                ❤️
              </button>

              <h3 className="text-lg font-semibold">{product.Name}</h3>
              <p className="text-sm text-gray-600">{product.CategoryName}</p>
              <p className="text-md font-bold">${product.Price}</p>
              <p className={`text-sm font-medium ${getStockStatusClass(product.StockQuantity)}`}>
                {product.StockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
              <button
                onClick={() => addToCart(product.ProductID)}
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </section>

        {/* Custom Notification */}
        {showNotification && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-md shadow-lg transition-opacity duration-500 ease-out opacity-100">
            {notification}
          </div>
        )}

        {/* View Cart Button */}
        <button
          onClick={openCartModal}
          className="bg-gray-700 text-white p-2 rounded mt-4"
        >
          View Cart
        </button>

        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="absolute top-2 left-2 text-xl font-bold text-gray-700"
              >
                🗑️
              </button>

              <button
                onClick={closeCartModal}
                className="absolute top-2 right-2 text-xl font-bold text-red-500"
              >
                ❌
              </button>

              <h2 className="text-2xl mb-4 text-center">Your Cart</h2>
              <div className="overflow-y-auto max-h-60">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Item Name</th>
                      <th className="py-2">Quantity</th>
                      <th className="py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <tr key={item.ProductID} className="border-b">
                          <td className="py-2">{item.Name}</td>
                          <td className="py-2 flex items-center justify-center">
                            <button
                              onClick={() => decreaseQuantity(item.ProductID)}
                              className="bg-gray-300 p-2 rounded"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.Quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.ProductID)}
                              className="bg-gray-300 p-2 rounded"
                            >
                              +
                            </button>
                          </td>
                          <td className="py-2">${item.Price * item.Quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-4">Your cart is empty</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button className="bg-green-500 text-white p-2 rounded mt-4 w-full">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
