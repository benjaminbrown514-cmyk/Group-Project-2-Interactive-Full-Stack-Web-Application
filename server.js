const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'companies.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    {
      "id": 1,
      "name": "OpenAI",
      "location": "San Francisco, CA",
      "description": "Leading AI research and deployment company building safe and beneficial AGI.",
      "website": "https://openai.com"
    },
    {
      "id": 2,
      "name": "NVIDIA",
      "location": "Santa Clara, CA",
      "description": "World leader in GPUs and AI computing platforms.",
      "website": "https://nvidia.com"
    },
    {
      "id": 3,
      "name": "Airbnb",
      "location": "San Francisco, CA",
      "description": "Global platform for booking unique accommodations and experiences.",
      "website": "https://airbnb.com"
    }
  ], null, 2));
}

app.get('/api/companies', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read companies' });
  }
});

app.post('/api/companies', (req, res) => {
  try {
    const { name, location, description, website } = req.body;
    
    if (!name || !location || !description || !website) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const companies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    const newCompany = {
      id: Date.now(),
      name,
      location,
      description,
      website
    };

    companies.unshift(newCompany);
    fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));

    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add company' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
