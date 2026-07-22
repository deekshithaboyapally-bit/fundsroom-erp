const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

// Test DB Route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected ✅",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed ❌" });
  }
});

// Basic Route
app.get("/", (req, res) => {
  res.send("Fundsroom ERP Backend is Running ✅");
});

// LOGIN ROUTE
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
});
// ===================== CUSTOMERS =====================

// ADD CUSTOMER
app.post("/customers", async (req, res) => {
  try {
    const {
      name, mobile, email, business_name, gst_number,
      customer_type, address, status, follow_up_date, notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO customers 
       (name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes]
    );

    res.status(201).json({ message: "Customer added ✅", customer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding customer ❌" });
  }
});

// GET ALL CUSTOMERS (with search)
app.get("/customers", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM customers";
    let params = [];

    if (search) {
      query = "SELECT * FROM customers WHERE name ILIKE $1 OR email ILIKE $1 OR mobile LIKE $1";
      params = [`%${search}%`];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customers ❌" });
  }
});

// GET CUSTOMER BY ID
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});

// EDIT CUSTOMER
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, status, notes } = req.body;

    const result = await pool.query(
      `UPDATE customers 
       SET name=$1, mobile=$2, email=$3, status=$4, notes=$5 
       WHERE id=$6 RETURNING *`,
      [name, mobile, email, status, notes, id]
    );

    res.json({ message: "Customer updated ✅", customer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ❌" });
  }
});

// ADD FOLLOW-UP NOTE
app.post("/customers/:id/notes", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      "UPDATE customers SET notes=$1 WHERE id=$2 RETURNING *",
      [notes, id]
    );

    res.json({ message: "Note added ✅", customer: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});
// ===================== PRODUCTS =====================

// ADD PRODUCT
app.post("/products", async (req, res) => {
  try {
    const {
      name, sku, category, unit_price,
      current_stock, min_stock_alert, location
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products 
       (name, sku, category, unit_price, current_stock, min_stock_alert, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, sku, category, unit_price, current_stock, min_stock_alert, location]
    );

    res.status(201).json({ 
      message: "Product added ✅", 
      product: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product ❌" });
  }
});

// GET ALL PRODUCTS (with search)
app.get("/products", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM products";
    let params = [];

    if (search) {
      query = `SELECT * FROM products 
               WHERE name ILIKE $1 OR sku ILIKE $1`;
      params = [`%${search}%`];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products ❌" });
  }
});

// GET PRODUCT BY ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1", 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});

// EDIT PRODUCT
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, category, unit_price, 
      min_stock_alert, location 
    } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name=$1, category=$2, unit_price=$3, 
           min_stock_alert=$4, location=$5 
       WHERE id=$6 RETURNING *`,
      [name, category, unit_price, min_stock_alert, location, id]
    );

    res.json({ 
      message: "Product updated ✅", 
      product: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ❌" });
  }
});

// LOW STOCK ALERT
app.get("/products/low-stock", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE current_stock <= min_stock_alert`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});
// ===================== CHALLANS =====================

// CREATE CHALLAN
app.post("/challans", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { customer_id, items, status, created_by } = req.body;
    // items = [{ product_id, quantity }]

    // Auto generate challan number
    const challanNumber = "CHL-" + Date.now();

    // Calculate total quantity
    let totalQuantity = 0;
    items.forEach(item => {
      totalQuantity += item.quantity;
    });

    // Create challan
    const challanResult = await client.query(
      `INSERT INTO challans 
       (challan_number, customer_id, status, total_quantity, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [challanNumber, customer_id, status, totalQuantity, created_by]
    );

    const challan = challanResult.rows[0];

    // Process each item
    for (const item of items) {
      // Get product details (snapshot)
      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ 
          message: `Product ID ${item.product_id} not found` 
        });
      }

      const product = productResult.rows[0];

      // If confirmed → check and reduce stock
      if (status === "Confirmed") {
        if (product.current_stock < item.quantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}. Available: ${product.current_stock}`
          });
        }

        // Reduce stock
        await client.query(
          "UPDATE products SET current_stock = current_stock - $1 WHERE id = $2",
          [item.quantity, item.product_id]
        );

        // Log stock movement
        await client.query(
          `INSERT INTO stock_movements 
           (product_id, quantity, movement_type, reason, created_by)
           VALUES ($1,$2,'OUT','Challan: ' || $3, $4)`,
          [item.product_id, item.quantity, challanNumber, created_by]
        );
      }

      // Save challan item with product snapshot
      await client.query(
        `INSERT INTO challan_items 
         (challan_id, product_id, product_name, product_sku, unit_price, quantity)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          challan.id,
          item.product_id,
          product.name,
          product.sku,
          product.unit_price,
          item.quantity
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Challan created ✅",
      challan
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Error creating challan ❌" });
  } finally {
    client.release();
  }
});

// GET ALL CHALLANS
app.get("/challans", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, cu.name as customer_name 
       FROM challans c
       LEFT JOIN customers cu ON c.customer_id = cu.id
       ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});

// GET CHALLAN BY ID (with items)
app.get("/challans/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const challan = await pool.query(
      `SELECT c.*, cu.name as customer_name 
       FROM challans c
       LEFT JOIN customers cu ON c.customer_id = cu.id
       WHERE c.id = $1`,
      [id]
    );

    if (challan.rows.length === 0) {
      return res.status(404).json({ message: "Challan not found" });
    }

    const items = await pool.query(
      "SELECT * FROM challan_items WHERE challan_id = $1",
      [id]
    );

    res.json({
      challan: challan.rows[0],
      items: items.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  }
});

// UPDATE CHALLAN STATUS
app.put("/challans/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { status } = req.body;

    // Get current challan
    const challanResult = await client.query(
      "SELECT * FROM challans WHERE id = $1",
      [id]
    );

    if (challanResult.rows.length === 0) {
      return res.status(404).json({ message: "Challan not found" });
    }

    const challan = challanResult.rows[0];

    // If confirming → reduce stock
    if (status === "Confirmed" && challan.status === "Draft") {
      const items = await client.query(
        "SELECT * FROM challan_items WHERE challan_id = $1",
        [id]
      );

      for (const item of items.rows) {
        const product = await client.query(
          "SELECT * FROM products WHERE id = $1",
          [item.product_id]
        );

        if (product.rows[0].current_stock < item.quantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            message: `Insufficient stock for ${item.product_name}`
          });
        }

        await client.query(
          "UPDATE products SET current_stock = current_stock - $1 WHERE id = $2",
          [item.quantity, item.product_id]
        );
      }
    }

    // Update status
    const result = await client.query(
      "UPDATE challans SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );

    await client.query("COMMIT");

    res.json({ 
      message: "Challan updated ✅", 
      challan: result.rows[0] 
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Error ❌" });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});