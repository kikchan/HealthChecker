require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { initDB, getPool } = require('./db');

const app = express();
const PORT = process.env.API_PORT || 3000;

(async () => {
  await initDB();
  const pool = getPool();

  app.get('/check/:service_name', async (req, res) => {
    const [rows] = await pool.query(
      "SELECT url FROM services WHERE service_name=?",
      [req.params.service_name]
    );

    if (!rows.length) return res.status(404).json({ error: "Service not found" });

    try {
      const r = await axios.get(rows[0].url, { timeout: 10000 });
      return r.data?.online ? res.status(200).json(r.data)
                            : res.status(404).json("Service offline");
    } catch {
      return res.status(404).json({ error: "Request failed" });
    }
  });

  app.listen(PORT, () => console.log("API on port " + PORT));
})();
