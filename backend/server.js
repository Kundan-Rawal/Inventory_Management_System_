const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const productRoutes = require("./routes/products"); // Import your routes
const userRoutes = require("./routes/user");

const app = express();
const dbPath = path.join(__dirname, "./inventory.db");

app.use(cors());
app.use(express.json());

let db = null;

// Middleware to pass DB to all routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create Tables (Initialize Schema)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        unit TEXT,
        category TEXT,
        brand TEXT,
        stock INTEGER DEFAULT 0,
        status TEXT,
        image TEXT
      );
      
      CREATE TABLE IF NOT EXISTS inventory_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        old_stock INTEGER,
        new_stock INTEGER,
        changed_by TEXT,
        change_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id)
      );


      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

    `);

    // Mount Routes
    app.use('/api/products', productRoutes);
    app.use('/api/users',userRoutes);

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();