"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fashionProducts } from "@/data/fashion";
import { foodItems as seedFoodItems } from "@/data/food";
import { firebaseLogout, saveFirestoreCart, saveFirestoreDoc } from "@/lib/firebase";
import { makeOrderId } from "@/lib/format";
import { readStorage, writeStorage } from "@/utils/localStorage";

const AppContext = createContext(null);

export function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(fashionProducts);
  const [foods, setFoods] = useState(seedFoodItems);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readStorage("titu_user", null));
    setCart(readStorage("titu_cart", []));
    setProducts(readStorage("titu_products", fashionProducts));
    setFoods(readStorage("titu_foods", seedFoodItems));
    setWishlist(readStorage("titu_wish", []));
    setOrders(readStorage("titu_orders", []));
    setBookings(readStorage("titu_bookings", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage("titu_cart", cart);
    if (user) saveFirestoreCart(user, cart).catch(() => {});
  }, [cart, ready, user]);

  useEffect(() => {
    if (ready) writeStorage("titu_products", products);
  }, [products, ready]);

  useEffect(() => {
    if (ready) writeStorage("titu_foods", foods);
  }, [foods, ready]);

  useEffect(() => {
    if (ready) writeStorage("titu_wish", wishlist);
  }, [wishlist, ready]);

  useEffect(() => {
    if (ready) writeStorage("titu_orders", orders);
  }, [orders, ready]);

  useEffect(() => {
    if (ready) writeStorage("titu_bookings", bookings);
  }, [bookings, ready]);

  useEffect(() => {
    if (ready) {
      if (user) writeStorage("titu_user", user);
      else localStorage.removeItem("titu_user");
    }
  }, [user, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message) => setToast(message);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      showToast("Please fill all fields");
      return false;
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        showToast(data.error || "Login failed");
        return false;
      }
      setUser(data.user);
      setAuthModal(null);
      showToast(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (error) {
      showToast(error.message || "Login failed");
      return false;
    }
  };

  const adminLogin = async ({ email, password }) => {
    const ok = await login({ email, password });
    if (!ok) return false;
    try {
      const response = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.role !== "admin") {
        setUser(null);
        showToast("This account is not authorized for admin access");
        return false;
      }
      setUser((current) => ({ ...(current || {}), role: "admin" }));
      showToast("Admin access granted");
      return true;
    } catch (error) {
      showToast("Unable to verify admin role");
      return false;
    }
  };

  const signup = async ({ name, fullName, email, phone, mobile, password, confirmPassword }) => {
    const displayName = fullName || name;
    const mobileNumber = mobile || phone;
    if (!displayName || !email || !mobileNumber || !password || !confirmPassword) {
      showToast("Please fill all fields");
      return false;
    }
    try {
      const response = await fetch("/api/auth/signup/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: displayName, email, mobile: mobileNumber, password, confirmPassword })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        showToast(data.error || "Signup failed");
        return false;
      }
      setAuthModal(null);
      showToast("OTP sent to your email");
      return data;
    } catch (error) {
      showToast(error.message || "Signup failed");
      return false;
    }
  };

  const resetPassword = async (email) => {
    if (!email) {
      showToast("Enter your email first");
      return false;
    }
    try {
      const response = await fetch("/api/auth/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        showToast(data.error || "Password reset failed");
        return false;
      }
      setAuthModal(null);
      showToast("Password reset OTP sent");
      return data;
    } catch (error) {
      showToast(error.message || "Password reset failed");
      return false;
    }
  };

  const logout = async () => {
    await firebaseLogout();
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    showToast("Logged out successfully");
  };

  const addToCart = (item, type = "fashion") => {
    if (!user) {
      setAuthModal("login");
      showToast("Please login to add items");
      return;
    }
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id && cartItem.type === type);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [
        ...current,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img || "",
          icon: item.icon || "",
          qty: 1,
          type
        }
      ];
    });
    showToast("Added to cart");
  };

  const addProduct = (product) => {
    const id = `admin-${Date.now()}`;
    const nextProduct = {
      ...product,
      id,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      distance: product.distance || 20,
      source: "admin"
    };
    setProducts((current) => [nextProduct, ...current]);
    saveFirestoreDoc("fashion_products", nextProduct).catch(() => {});
    fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProduct)
    }).catch(() => {});
    showToast("Product added successfully");
    return nextProduct;
  };

  const updateProduct = (id, product) => {
    setProducts((current) => current.map((item) => (item.id === id ? { ...item, ...product } : item)));
    setCart((current) => current.map((item) => (item.id === id ? { ...item, name: product.name, price: product.price, img: product.img } : item)));
    fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...product })
    }).catch(() => {});
    showToast("Product updated successfully");
  };

  const deleteProduct = (id) => {
    setProducts((current) => current.filter((item) => item.id !== id));
    setCart((current) => current.filter((item) => item.id !== id));
    setWishlist((current) => current.filter((item) => item !== id));
    fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    showToast("Product deleted successfully");
  };

  const addFood = (food) => {
    const id = `food-${Date.now()}`;
    const nextFood = {
      ...food,
      id,
      source: "admin"
    };
    setFoods((current) => [nextFood, ...current]);
    saveFirestoreDoc("restaurant_products", nextFood).catch(() => {});
    fetch("/api/admin/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextFood)
    }).catch(() => {});
    showToast("Dish added successfully");
    return nextFood;
  };

  const updateFood = (id, food) => {
    setFoods((current) => current.map((item) => (item.id === id ? { ...item, ...food } : item)));
    setCart((current) => current.map((item) => (item.id === id ? { ...item, name: food.name, price: food.price, img: food.img } : item)));
    fetch(`/api/admin/food/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...food })
    }).catch(() => {});
    showToast("Dish updated successfully");
  };

  const deleteFood = (id) => {
    setFoods((current) => current.filter((item) => item.id !== id));
    setCart((current) => current.filter((item) => item.id !== id));
    fetch(`/api/admin/food/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    showToast("Dish deleted successfully");
  };

  const addCustomPrintOrder = (order) => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    setCart((current) => [...current, { ...order, id: Date.now(), qty: 1, type: "print" }]);
    showToast("Print order added to cart");
  };

  const changeQty = (id, delta, type) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id && (!type || item.type === type) ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id, type) => setCart((current) => current.filter((item) => !(item.id === id && (!type || item.type === type))));

  const toggleWish = (id) => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const placeOrder = ({ fullName, name, email, address, city, state, pincode, phone, paymentMethod = "UPI / GPay" }) => {
    if (!address || !phone || !city || !state || !pincode) {
      showToast("Please fill delivery details");
      return null;
    }
    if (!cart.length) {
      showToast("Your cart is empty");
      return null;
    }
    const id = makeOrderId();
    const orderSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderDelivery = orderSubtotal > 299 || orderSubtotal === 0 ? 0 : 49;
    const orderTotal = orderSubtotal + orderDelivery;
    const createdAt = new Date();
    const customerName = fullName || name || user?.name || "TituHub Customer";
    const shippingAddress = {
      fullName: customerName,
      phone,
      email: email || user?.email || "",
      address,
      city,
      state,
      pincode
    };
    const order = {
      id,
      customer: customerName,
      customerDetails: shippingAddress,
      email: shippingAddress.email,
      phone,
      address: `${address}, ${city}, ${state} - ${pincode}`,
      shippingAddress,
      items: cart,
      date: createdAt.toLocaleDateString("en-IN"),
      dateTime: createdAt.toISOString(),
      eta: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Pending",
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      subtotal: orderSubtotal,
      delivery: orderDelivery,
      total: orderTotal,
      isNew: true
    };
    setOrders((current) => [order, ...current]);
    saveFirestoreDoc("orders", order).catch(() => {});
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).catch(() => {});
    setCart([]);
    setCheckoutOpen(false);
    showToast("Order placed successfully");
    return id;
  };

  const bookTable = async (booking) => {
    if (!booking.name || !booking.phone || !booking.date || !booking.time || !booking.guests) {
      showToast("Please complete booking details");
      return null;
    }
    const nextBooking = {
      ...booking,
      id: `TB-${Date.now()}`,
      status: "Pending"
    };
    setBookings((current) => [nextBooking, ...current]);
    await saveFirestoreDoc("bookings", nextBooking).catch(() => null);
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextBooking)
    }).catch(() => {});
    showToast("Table booking request sent");
    return nextBooking.id;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
              isNew: false,
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
    showToast(`${id} updated to ${status}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 299 || subtotal === 0 ? 0 : 49;
  const discount = 0;
  const total = subtotal + delivery;

  const value = {
    user,
    setUser,
    login,
    adminLogin,
    signup,
    resetPassword,
    logout,
    cart,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    foods,
    addFood,
    updateFood,
    deleteFood,
    cartCount,
    subtotal,
    delivery,
    discount,
    total,
    cartOpen,
    setCartOpen,
    authModal,
    setAuthModal,
    checkoutOpen,
    setCheckoutOpen,
    addToCart,
    addCustomPrintOrder,
    changeQty,
    removeItem,
    wishlist,
    toggleWish,
    orders,
    placeOrder,
    bookings,
    bookTable,
    updateOrderStatus,
    toast,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProviders");
  return context;
}
