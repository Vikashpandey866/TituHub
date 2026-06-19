export const foodCategories = ["All", "Pizza", "Burger", "Drinks", "Dessert", "Combo Meals", "Veg", "Non-Veg"];

export const foodItems = [
  { id: 101, name: "Truffle Margherita Pizza", desc: "Wood-fired sourdough base, San Marzano sauce, basil and truffle oil", price: 389, category: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85", tags: ["veg", "popular"], eta: "24 min", rating: 4.8, deliveryTime: "24 min" },
  { id: 102, name: "Pepperoni Royale Pizza", desc: "Mozzarella, smoked pepperoni, chilli honey and parmesan dust", price: 449, category: "Pizza", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85", tags: ["non-veg", "popular"], eta: "26 min", rating: 4.7, deliveryTime: "26 min" },
  { id: 103, name: "Classic Smash Burger", desc: "Double seared patty, cheddar, caramelized onion and house sauce", price: 299, category: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=85", tags: ["non-veg"], eta: "18 min", rating: 4.6, deliveryTime: "18 min" },
  { id: 104, name: "Paneer Makhani Burger", desc: "Crispy paneer steak, makhani glaze, pickled onion and lettuce", price: 249, category: "Burger", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&q=85", tags: ["veg", "spicy"], eta: "17 min", rating: 4.5, deliveryTime: "17 min" },
  { id: 105, name: "Alfredo Mushroom Pasta", desc: "Creamy parmesan sauce, roasted mushrooms and cracked pepper", price: 329, category: "Pasta", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=85", tags: ["veg"], eta: "21 min", rating: 4.6, deliveryTime: "21 min" },
  { id: 106, name: "Arrabbiata Chicken Penne", desc: "Fiery tomato sauce, grilled chicken, basil and aged cheese", price: 359, category: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=85", tags: ["non-veg", "spicy"], eta: "22 min", rating: 4.7, deliveryTime: "22 min" },
  { id: 107, name: "Dragon Chilli Noodles", desc: "Wok-tossed noodles with garlic, peppers and chilli crisp", price: 229, category: "Chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900&q=85", tags: ["veg", "spicy"], eta: "16 min", rating: 4.4, deliveryTime: "16 min" },
  { id: 108, name: "Kung Pao Chicken Bowl", desc: "Tender chicken, peanuts, scallions and jasmine rice", price: 319, category: "Chinese", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=900&q=85", tags: ["non-veg", "popular"], eta: "20 min", rating: 4.6, deliveryTime: "20 min" },
  { id: 109, name: "Hyderabadi Dum Biryani", desc: "Long-grain basmati, saffron, mint and slow-cooked chicken", price: 369, category: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03246963d651?w=900&q=85", tags: ["non-veg", "popular"], eta: "28 min", rating: 4.9, deliveryTime: "28 min" },
  { id: 110, name: "Royal Veg Biryani", desc: "Fragrant basmati, vegetables, paneer, saffron and fried onion", price: 269, category: "Biryani", img: "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=900&q=85", tags: ["veg"], eta: "24 min", rating: 4.5, deliveryTime: "24 min" },
  { id: 111, name: "Butter Chicken Signature", desc: "Smoky tandoori chicken in silky tomato cashew gravy", price: 389, category: "Biryani", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=85", tags: ["non-veg"], eta: "23 min", rating: 4.8, deliveryTime: "23 min" },
  { id: 112, name: "Paneer Tikka Platter", desc: "Charred cottage cheese, peppers, mint chutney and salad", price: 279, category: "Chinese", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=85", tags: ["veg", "popular"], eta: "18 min", rating: 4.6, deliveryTime: "18 min" },
  { id: 113, name: "Chocolate Lava Cake", desc: "Molten Belgian chocolate cake with vanilla cream", price: 169, category: "Desserts", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=85", tags: ["veg", "popular"], eta: "12 min", rating: 4.7, deliveryTime: "12 min" },
  { id: 114, name: "Lotus Biscoff Cheesecake", desc: "Cream cheese mousse, biscuit crumble and caramel glaze", price: 219, category: "Desserts", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=85", tags: ["veg"], eta: "10 min", rating: 4.8, deliveryTime: "10 min" },
  { id: 115, name: "Cold Brew Orange Tonic", desc: "Slow-brew coffee, orange zest and sparkling tonic", price: 179, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=900&q=85", tags: ["veg"], eta: "8 min", rating: 4.4, deliveryTime: "8 min" },
  { id: 116, name: "Mango Basil Cooler", desc: "Alphonso mango, basil seed, lime and crushed ice", price: 159, category: "Drinks", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=85", tags: ["veg"], eta: "8 min", rating: 4.5, deliveryTime: "8 min" }
];

export const aiResponses = {
  order: "Your order is being prepared. Estimated delivery is 18-25 minutes. Track it in TituEats > My Orders.",
  delivery: "Delivery time is 15-30 minutes within 15 KM. Areas beyond 15 KM are currently unavailable.",
  spicy: "Try Masala Dosa, spicy paneer starters, or a hot biryani combo for a proper heat hit.",
  veg: "Veg options include Paneer Tikka, Veg Biryani, Masala Dosa, Dal Makhani, Veg Pizza and more.",
  payment: "For payment issues, retry UPI, switch to card, or choose Cash on Delivery. Your cart stays saved.",
  fallback: "I can help with orders, delivery time, food suggestions, and payment questions."
};
