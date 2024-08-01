const axios = require('axios');
const fs = require('fs-extra');

const URL = 'https://dummyjson.com/products';

async function fetchAndStoreData() {
  try {
    const response = await axios.get(URL);
    await fs.writeJson('./data.json', response.data);
    console.log('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
}

module.exports = fetchAndStoreData;