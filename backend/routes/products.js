const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 1. GET ALL / SEARCH
router.get('/', async (req, res) => {
    try {
        const { name } = req.query;
        let sql = "SELECT * FROM products";
        let params = [];

        if (name) {
            sql += " WHERE name LIKE ?";
            params.push(`%${name}%`);
        }

        // ACCESS DB via req.db
        const rows = await req.db.all(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. IMPORT CSV (Cleaner Async Flow)
router.post('/import', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const results = [];
    const duplicates = [];
    let addedCount = 0;
    let skippedCount = 0;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const { name, stock } = row;
                    if (!name) continue;

                    // Async Check
                    const existing = await req.db.get(
                        "SELECT id FROM products WHERE name = ? COLLATE NOCASE", 
                        [name]
                    );

                    if (existing) {
                        skippedCount++;
                        duplicates.push({ name, existingId: existing.id });
                    } else {
                        // Async Insert
                        await req.db.run(
                            `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [name, row.unit, row.category, row.brand, parseInt(stock) || 0, row.status, row.image]
                        );
                        addedCount++;
                    }
                }
                fs.unlinkSync(req.file.path);
                res.json({ added: addedCount, skipped: skippedCount, duplicates });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
});

// 3. UPDATE PRODUCT & HISTORY
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, unit, category, brand, stock, status, image, changed_by } = req.body;

    try {
        const oldProduct = await req.db.get("SELECT * FROM products WHERE id = ?", [id]);
        if (!oldProduct) return res.status(404).json({ error: "Product not found" });

        // History Logic
        const newStock = parseInt(stock);
        if (stock !== undefined && oldProduct.stock !== newStock) {
            await req.db.run(
                `INSERT INTO inventory_logs (product_id, old_stock, new_stock, changed_by) VALUES (?, ?, ?, ?)`,
                [id, oldProduct.stock, newStock, changed_by || 'System']
            );
        }

        // Update Logic
        await req.db.run(
            `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
            [
                name || oldProduct.name,
                unit || oldProduct.unit,
                category || oldProduct.category,
                brand || oldProduct.brand,
                stock !== undefined ? stock : oldProduct.stock,
                status || oldProduct.status,
                image || oldProduct.image,
                id
            ]
        );

        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET HISTORY
router.get('/:id/history', async (req, res) => {
    try {
        const rows = await req.db.all(
            "SELECT * FROM inventory_logs WHERE product_id = ? ORDER BY change_timestamp DESC", 
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/export', async (req, res) => {
    try {
        // 1. Fetch all products
        const rows = await req.db.all("SELECT * FROM products");

        // 2. Define CSV Headers (Must match your DB columns roughly)
        const fields = ['name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
        const header = fields.join(',');

        // 3. Convert Data to CSV Format
        const csvRows = rows.map(row => {
            return fields.map(field => {
                // Safety: Wrap in quotes and escape existing quotes
                const val = row[field] ? String(row[field]).replace(/"/g, '""') : '';
                return `"${val}"`;
            }).join(',');
        });

        // 4. Combine Header + Rows
        const csvString = [header, ...csvRows].join('\n');

        // 5. Send as Download
        res.header('Content-Type', 'text/csv');
        res.attachment('inventory_export.csv'); // Triggers download in browser
        return res.send(csvString);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.post('/', async (req, res) => {
    const { name, unit, category, brand, stock, status, image } = req.body;
    
    if (!name) return res.status(400).json({ error: "Product name is required" });

    try {
        // Check for duplicates
        const existing = await req.db.get("SELECT id FROM products WHERE name = ? COLLATE NOCASE", [name]);
        if (existing) return res.status(400).json({ error: "Product with this name already exists" });

        const result = await req.db.run(
            `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, unit, category, brand, parseInt(stock) || 0, status || 'In Stock', image]
        );
        
        res.status(201).json({ id: result.lastID, message: "Product created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Optional: Delete associated history logs first to keep DB clean
        await req.db.run("DELETE FROM inventory_logs WHERE product_id = ?", [id]);
        
        const result = await req.db.run("DELETE FROM products WHERE id = ?", [id]);
        
        if (result.changes === 0) return res.status(404).json({ error: "Product not found" });
        
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;