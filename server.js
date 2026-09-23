const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Database(path.join(__dirname, "data", "shop.db"));
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image TEXT DEFAULT '',
    featured INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    neighborhood TEXT DEFAULT '',
    city TEXT DEFAULT '',
    needs_delivery INTEGER NOT NULL DEFAULT 0,
    order_date TEXT NOT NULL,
    delivery_date TEXT,
    notes TEXT DEFAULT '',
    subtotal INTEGER NOT NULL,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendiente',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const categoryCount = db.prepare("SELECT COUNT(*) AS count FROM categories").get().count;

if (categoryCount === 0) {
  const insertCategory = db.prepare("INSERT INTO categories (name) VALUES (?)");
  const categories = [
    "Camisas", "Manillas", "Anillos", "Perfumes", "Relojes",
    "Ropa interior", "Medias", "Cremas", "Bolsos", "Otros"
  ];
  const addCategories = db.transaction(() => {
    for (const category of categories) insertCategory.run(category);
  });
  addCategories();
}

const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;

if (productCount === 0) {
  const categoryId = (name) =>
    db.prepare("SELECT id FROM categories WHERE name = ?").get(name).id;

  const insert = db.prepare(`
    INSERT INTO products
      (category_id, name, description, price, stock, image, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    ["Camisas", "Camisa oversize", "Camisa femenina de estilo casual.", 45000, 10, "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=80", 1],
    ["Manillas", "Manilla dorada", "Accesorio delicado para complementar tu look.", 25000, 15, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=80", 1],
    ["Anillos", "Anillo corazón", "Anillo elegante con diseño de corazón.", 30000, 12, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80", 1],
    ["Perfumes", "Perfume Woman", "Fragancia femenina con notas florales y frutales.", 80000, 8, "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80", 1],
    ["Relojes", "Reloj dorado", "Reloj femenino de estilo elegante.", 120000, 6, "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80", 1],
    ["Ropa interior", "Set femenino", "Set cómodo y delicado.", 65000, 9, "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80", 0],
    ["Medias", "Medias básicas", "Medias suaves para uso diario.", 18000, 20, "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=80", 0],
    ["Cremas", "Crema hidratante", "Crema para una rutina de cuidado personal.", 35000, 14, "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80", 0],
    ["Bolsos", "Bolso negro", "Bolso versátil para cualquier ocasión.", 95000, 7, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80", 0]
  ];

  const addProducts = db.transaction(() => {
    for (const p of products) insert.run(categoryId(p[0]), ...p.slice(1));
  });
  addProducts();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/categories", (req, res) => {
  res.json(db.prepare("SELECT * FROM categories ORDER BY name").all());
});

app.get("/api/products", (req, res) => {
  const { category, featured, search } = req.query;
  let sql = `
    SELECT p.*, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE 1 = 1
  `;
  const params = [];

  if (category) {
    sql += " AND c.name = ?";
    params.push(category);
  }
  if (featured === "1") sql += " AND p.featured = 1";
  if (search) {
    sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY p.featured DESC, p.id DESC";
  res.json(db.prepare(sql).all(...params));
});

app.get("/api/products/:id", (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

app.post("/api/orders", (req, res) => {
  const {
    customer_name, phone, email, address, neighborhood, city,
    needs_delivery, order_date, delivery_date, notes, items
  } = req.body;

  if (!customer_name || !phone || !order_date || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
  const insertOrder = db.prepare(`
    INSERT INTO orders
      (customer_name, phone, email, address, neighborhood, city, needs_delivery,
       order_date, delivery_date, notes, subtotal, delivery_fee, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (?, ?, ?, ?)
  `);
  const updateStock = db.prepare(`
    UPDATE products SET stock = stock - ? WHERE id = ?
  `);

  try {
    const result = db.transaction(() => {
      let subtotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = getProduct.get(item.product_id);
        const quantity = Number(item.quantity);

        if (!product || !Number.isInteger(quantity) || quantity < 1) {
          throw new Error("Producto o cantidad inválida.");
        }
        if (quantity > product.stock) {
          throw new Error(`No hay suficiente stock de ${product.name}.`);
        }

        subtotal += product.price * quantity;
        validatedItems.push({ product, quantity });
      }

      const deliveryFee = needs_delivery ? 8000 : 0;
      const total = subtotal + deliveryFee;

      const order = insertOrder.run(
        customer_name, phone, email || "", address || "", neighborhood || "",
        city || "", needs_delivery ? 1 : 0, order_date, delivery_date || null,
        notes || "", subtotal, deliveryFee, total
      );

      for (const item of validatedItems) {
        insertItem.run(order.lastInsertRowid, item.product.id, item.quantity, item.product.price);
        updateStock.run(item.quantity, item.product.id);
      }

      return { id: order.lastInsertRowid, subtotal, deliveryFee, total };
    })();

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT id, customer_name, phone, city, needs_delivery,
           order_date, delivery_date, subtotal, delivery_fee, total,
           status, created_at
    FROM orders
    ORDER BY id DESC
  `).all();

  res.json(orders);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`The Dream Girl Shop: http://localhost:${PORT}`);
});