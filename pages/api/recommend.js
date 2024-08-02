import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { minPrice, maxPrice, selectedOptions } = req.body;

    try {
      const response = await axios.post('http://localhost:5000/recommend', {
        minPrice,
        maxPrice,
        selectedOptions,
      });

      // Ensure the response contains an array of laptops
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error calling Flask API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
