require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDB, getPool } = require('./db');

const app = express();
const PORT = process.env.UI_PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

(async () => {
  await initDB();
  const pool = getPool();

  app.get('/', async (_, res) => {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY id DESC");
    res.render('index', { services: rows });
  });

  app.post('/services', async (req, res) => {
    await pool.query("INSERT INTO services (service_name, url) VALUES (?, ?)",
      [req.body.service_name, req.body.url]);
    res.redirect('/');
  });

  app.post('/services/:id/delete', async (req, res) => {
    await pool.query("DELETE FROM services WHERE id=?", [req.params.id]);
    res.redirect('/');
  });

  app.post('/services/:id/update', async (req, res) => {
    await pool.query("UPDATE services SET service_name=?, url=? WHERE id=?",
      [req.body.service_name, req.body.url, req.params.id]);
    res.redirect('/');
  });

  app.listen(PORT, () => console.log("UI on port " + PORT));
})();
