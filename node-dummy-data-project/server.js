const express = require('express');
const fs = require('fs-extra');
const fetchAndStoreData = require('./fetchData');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Initialization script
(async function init() {
  if (!(await fs.pathExists('./data.json'))) {
    await fetchAndStoreData();
  }
})();

// API endpoint to serve data
app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readJson('./data.json');
    let products = data.products;

    // Filtering
    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }

    // Sorting
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      products.sort((a, b) => {
        if (order === 'asc') {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});