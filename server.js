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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function initializeDatabase() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        const initialCompanies = [
            { id: 1, name: "OpenAI", location: "San Francisco, CA", description: "Leading AI research company behind ChatGPT.", website: "https://openai.com" },
            { id: 2, name: "NVIDIA", location: "Santa Clara, CA", description: "World leader in GPUs and AI hardware.", website: "https://nvidia.com" },
            { id: 3, name: "Airbnb", location: "San Francisco, CA", description: "Global marketplace for unique travel experiences.", website: "https://airbnb.com" },
            { id: 4, name: "Stripe", location: "South San Francisco, CA", description: "Payments infrastructure for the internet.", website: "https://stripe.com" }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialCompanies, null, 2));
        console.log('✅ Created companies.json with sample data');
    }
}

initializeDatabase();

app.get('/api/companies', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
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
        const newCompany = { id: Date.now(), name: name.trim(), location: location.trim(), description: description.trim(), website: website.trim() };

        companies.unshift(newCompany);
        fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));

        res.status(201).json(newCompany);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add company' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Static files served from: ${path.join(__dirname, 'public')}`);
});
