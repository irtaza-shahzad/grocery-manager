import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenPayload } from '../utils/auth'; // Ensure this path is correct
import Button from '../components/Button'; // Ensure this path is correct
import axios from 'axios';

const Dashboard = () => {
  const payload = getTokenPayload();
  const userId = payload.id; // Ensure your token payload contains the user ID
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
  const [reviewModal, setReviewModal] = useState(false);
  const [productId, setProductId] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [pid, setPid] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const navigate = useNavigate();

  // Fetch products on page load and when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = 'http://localhost:3000/api/products';

        if (selectedCategory) {
          url = `http://localhost:3000/api/products/category/${selectedCategory}`;
        } else if (minPrice !== '' && maxPrice !== '') {
          url = `http://localhost:3000/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`;
        } else if (searchTerm) {
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
      fetchCart();
    }
  }, [userId]);

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
      fetchFavorites();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Function to fetch cart
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

  // Function to add item to cart
  const addToCart = async (productId) => {
    try {
      let quantity = 1;

      const product = products.find((product) => product.ProductID === productId);
      const updatedCart = [
        ...cart,
        { ...product, Quantity: quantity, ProductID: product.ProductID },
      ];
      setCart(updatedCart);

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
          setShowNotification(false);
        }, 2000);

        fetchCart();
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
      return 'text-green-500';
    }
    return 'text-red-500';
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
        setCart([]);
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
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const favoriteItem = favorites.find((item) => item.ProductID === productId);
      
      if (!favoriteItem) {
        console.error('Favorite not found for product:', productId);
        return;
      }
  
      const favoriteId = favoriteItem.FavouriteID;
  
      const response = await fetch(`http://localhost:3000/api/favorites/${favoriteId}/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setFavorites((prevFavorites) => prevFavorites.filter((item) => item.ProductID !== productId));
      } else {
        console.error('Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  // Function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.find((item) => item.ProductID === productId) ? true : false;
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

  // Function to update cart quantity
  const updateCartQuantity = async (productId, quantity) => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (response.ok) {
        fetchCart();
      } else {
        console.error('Failed to update cart quantity');
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    }
  };

  // Update the cart total dynamically (based on price * quantity)
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.Price * item.Quantity, 0);
  };

  // Function to open the favorites modal
  const openFavoritesModal = () => {
    setShowFavoritesModal(true);
  };

  // Function to close the favorites modal
  const closeFavoritesModal = () => {
    setShowFavoritesModal(false);
  };

  return (
    <>
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
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              className="p-2 border rounded"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="p-2 border rounded"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by name"
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={() => {
                setSelectedCategory('');
                setMinPrice('');
                setMaxPrice('');
                setSearchTerm('');
              }}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Reset
            </button>

            <button
              onClick={openCartModal}
              className="p-2 bg-blue-600 text-white rounded"
            >
              View Cart ({cart.length})
            </button>

            {/* View Favorites Button */}
            <button
              onClick={openFavoritesModal}
              className="p-2 bg-green-600 text-white rounded"
            >
              View Favorites ({favorites.length})
            </button>
          </div>

          {/* NOTIFICATION */}
          {showNotification && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
              {notification}
            </div>
          )}

          {/* PRODUCT LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.ProductID} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{product.Name}</h3>
                <p className="text-sm text-gray-500">Category: {product.CategoryName}</p>
                <p className="text-sm">Price: Rs. {product.Price}</p>
                <p className={`text-sm ${getStockStatusClass(product.StockQuantity)}`}>
                  {product.StockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => addToCart(product.ProductID)}
                    disabled={product.StockQuantity <= 0}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      isFavorite(product.ProductID)
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                    onClick={() => handleFavorite(product.ProductID)}
                  >
                    {isFavorite(product.ProductID) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CART MODAL */}
          {showCartModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.ProductID}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div>
                        <h3 className="font-semibold">{item.Name}</h3>
                        <p>Price: Rs. {item.Price}</p>
                        <p>Quantity: {item.Quantity}</p>
                        {/* Display total price for this item */}
                        <p className="font-semibold">Total: Rs. {item.Price * item.Quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Removed the +, -, and "Remove" buttons */}
                      </div>
                    </div>
                  ))
                )}
                <div className="mt-4 flex justify-between">
                  <p className="font-semibold">Total: Rs. {getCartTotal()}</p>
                  <button
                    onClick={clearCart}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={closeCartModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>

               
              </div>
            </div>
          )}

          {/* FAVORITES MODAL */}
          {showFavoritesModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Your Favorite Products</h2>
                {favorites.length === 0 ? (
                  <p>Your favorites list is empty.</p>
                ) : (
                  <div>
                    {favorites.map((item) => (
                      <div key={item.ProductID} className="flex justify-between items-center border-b py-2">
                        <div>
                          <h3 className="font-semibold">{item.Name}</h3>
                          <p>Price: Rs. {item.Price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={closeFavoritesModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
