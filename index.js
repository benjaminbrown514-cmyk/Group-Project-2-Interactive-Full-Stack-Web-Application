const express = require('express');

const app = express();

app.get

app.post

const popularCompanies = ["Apple", "Google", "Microsoft", "OpenAI", "Tesla", "NVIDIA", "Meta", "Amazon", "Stripe", "Spotify", "Figma"];

function initializeSearch() {
    const searchInput = document.getElementById('company-search');
    const suggestionsBox = document.getElementById('search-suggestions');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        const matches = popularCompanies.filter(c => c.toLowerCase().includes(query));
        suggestionsBox.innerHTML = '';

        matches.forEach(company => {
            const div = document.createElement('div');
            div.className = 'px-6 py-3 cursor-pointer hover:bg-slate-800 flex items-center gap-3';
            div.innerHTML = `
                <img src="https://img.logo.dev/${company.toLowerCase()}.com?size=40" class="w-8 h-8" onerror="this.src='https://via.placeholder.com/32?text=${company[0]}'">
                <span>${company}</span>
            `;
            div.onclick = () => searchCompany(company);
            suggestionsBox.appendChild(div);
        });

        suggestionsBox.classList.remove('hidden');
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = searchInput.value.trim();
            if (val) searchCompany(val);
        }
    });
}
