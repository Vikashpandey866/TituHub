import fs from "fs";
import path from "path";
import { recentOrders } from "@/data/admin";
import { fashionProducts } from "@/data/fashion";
import { foodItems } from "@/data/food";
import { printServices } from "@/data/print";

const dbPath = path.join(process.cwd(), ".data", "tituhub-admin.json");

const fashionCategories = ["Saree", "T-Shirts", "Hoodies", "Shoes", "Watches", "Bags", "Ethnic Wear", "Jeans"];
const foodCategories = ["Pizza", "Burger", "Drinks", "Dessert", "Combo Meals"];
const printCategories = ["ID Card Printing", "T-Shirt Printing", "Banner Printing", "Poster Printing"];
const orderStatuses = ["Pending", "Confirmed", "Preparing", "Shipped", "Delivered", "Cancelled"];

function seedDb() {
  return {
    products: fashionProducts.map((product) => ({
      ...product,
      id: String(product.id),
      category: product.cat === "Sarees" ? "Saree" : product.cat,
      cat: product.cat === "Sarees" ? "Saree" : product.cat,
      description: product.desc || product.description || product.name,
      desc: product.desc || product.description || product.name,
      images: product.images || [product.img].filter(Boolean),
      sizes: product.sizes || ["S", "M", "L", "XL"],
      colors: product.colors || ["Black", "Orange"],
      stockQuantity: Number(product.stock || 0),
      source: product.source || "seed"
    })),
    foods: foodItems.map((food) => ({
      ...food,
      id: String(food.id),
      description: food.desc,
      isVeg: !food.tags.includes("non-veg"),
      available: food.available !== false,
      todaySpecial: Boolean(food.todaySpecial),
      bestSeller: Boolean(food.bestSeller || food.tags.includes("popular")),
      source: food.source || "seed"
    })),
    printServices: printServices
      .filter((service) => printCategories.includes(service.name) || service.name === "Custom T-Shirts")
      .map((service) => ({
        ...service,
        id: String(service.id),
        name: service.name === "Custom T-Shirts" ? "T-Shirt Printing" : service.name,
        sampleImages: service.sampleImages || []
      })),
    orders: recentOrders.map((order, index) => ({
      id: order.id,
      customer: order.customer,
      module: order.module,
      total: order.amount,
      amount: order.amount,
      status: order.status === "Accepted" ? "Confirmed" : order.status,
      createdAt: new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
      items: []
    })),
    bookings: [],
    blockedUsers: []
  };
}

function ensureDb() {
  if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify(seedDb(), null, 2));
}

export function readAdminDb() {
  ensureDb();
  return { ...seedDb(), ...JSON.parse(fs.readFileSync(dbPath, "utf8")) };
}

export function writeAdminDb(db) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function listAdminData() {
  return readAdminDb();
}

export function saveCollectionItem(collection, payload, id) {
  const db = readAdminDb();
  const now = new Date().toISOString();
  const item = {
    ...payload,
    id: id || `${collection}-${Date.now()}`,
    updatedAt: now,
    createdAt: payload.createdAt || now,
    source: payload.source || "admin"
  };
  db[collection] = id ? db[collection].map((entry) => String(entry.id) === String(id) ? { ...entry, ...item, id: String(id) } : entry) : [item, ...db[collection]];
  writeAdminDb(db);
  return item;
}

export function deleteCollectionItem(collection, id) {
  const db = readAdminDb();
  db[collection] = db[collection].filter((item) => String(item.id) !== String(id));
  writeAdminDb(db);
}

export function updateOrder(id, patch) {
  if (patch.status && !orderStatuses.includes(patch.status)) return { ok: false, error: "Invalid order status" };
  const db = readAdminDb();
  const order = db.orders.find((item) => String(item.id) === String(id));
  if (!order) return { ok: false, error: "Order not found" };
  Object.assign(order, patch, { updatedAt: new Date().toISOString() });
  writeAdminDb(db);
  return { ok: true, order };
}

export function updateBlockedUsers(email, blocked) {
  const db = readAdminDb();
  const normalized = String(email || "").trim().toLowerCase();
  db.blockedUsers = blocked
    ? Array.from(new Set([...db.blockedUsers, normalized]))
    : db.blockedUsers.filter((item) => item !== normalized);
  writeAdminDb(db);
  return db.blockedUsers;
}

export function adminMeta() {
  return { fashionCategories, foodCategories, printCategories, orderStatuses };
}
