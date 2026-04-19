const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data', 'companies.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function initializeDatabase() {
  const dataDir = path.join(__dirname, 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialCompanies = [
      {
        id: 1,
        name: "OpenAI",
        location: "San Francisco, CA",
        description: "Leading artificial intelligence research company behind ChatGPT.",
        website: "https://openai.com"
      },
      {
        id: 2,
        name: "NVIDIA",
        location: "Santa Clara, CA",
        description: "World leader in GPUs and AI computing hardware.",
        website: "https://nvidia.com"
      },
      {
        id: 3,
        name: "Airbnb",
        location: "San Francisco, CA",
        description: "Global platform for booking accommodations and experiences.",
        website: "https://airbnb.com"
      },
      {
        id: 4,
        name: "Stripe",
        location: "South San Francisco, CA",
        description: "Payments infrastructure for the internet.",
        website: "https://stripe.com"
      }
    ];

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialCompanies, null, 2));
    console.log('✅ Initialized companies.json with sample data');
  }
}

initializeDatabase();

app.get('/api/companies', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const companies = JSON.parse(data);
    res.json(companies);
  } catch (err) {
    console.error('Error reading companies.json:', err);
    res.status(500).json({ error: 'Failed to read companies data' });
  }
});

app.post('/api/companies', (req, res) => {
  try {
    const { name, location, description, website } = req.body;

    if (!name || !location || !description || !website) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const companies = JSON.parse(data);

    const newCompany = {
      id: Date.now(),
      name: name.trim(),
      location: location.trim(),
      description: description.trim(),
      website: website.trim()
    };

    companies.unshift(newCompany);

    fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));

    console.log(`✅ New company added: ${newCompany.name}`);
    res.status(201).json(newCompany);

  } catch (err) {
    console.error('Error saving to companies.json:', err);
    res.status(500).json({ error: 'Failed to save company' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Using File Database: ${DATA_FILE}`);
});
