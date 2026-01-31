require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const { initDB, getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function start() {
  await initDB();

  const pool = getPool();

  // CRUD UI
  app.get('/', async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY id DESC");
    res.render('index', { services: rows });
  });

  app.post('/services', async (req, res) => {
    const { service_name, url } = req.body;
    await pool.query(
      "INSERT INTO services (service_name, url) VALUES (?, ?)",
      [service_name, url]
    );
    res.redirect('/');
  });

  app.post('/services/:id/delete', async (req, res) => {
    await pool.query("DELETE FROM services WHERE id = ?", [req.params.id]);
    res.redirect('/');
  });

  app.post('/services/:id/update', async (req, res) => {
    const { service_name, url } = req.body;
    await pool.query(
      "UPDATE services SET service_name=?, url=? WHERE id=?",
      [service_name, url, req.params.id]
    );
    res.redirect('/');
  });

  // Health endpoint
  app.get('/check/:service_name', async (req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM services WHERE service_name = ?",
      [req.params.service_name]
    );

    if (!rows.length) return res.status(404).json({ error: "Service not found" });

    const service = rows[0];

    try {
      const response = await axios.get(service.url, { timeout: 10000 });

      if (response.data?.online === true) {
        return res.status(200).json(response.data);
      } else {
        return res.status(404).json(response.data);
      }
    } catch (e) {
      return res.status(404).json({ error: "Request failed" });
    }
  });

  app.listen(PORT, () => console.log("API running on port " + PORT));
}

start();
