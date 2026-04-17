let allCompanies = [];

async function fetchCompanies() {
    try {
        const res = await fetch('/api/companies');
        allCompanies = await res.json();
        renderCompanies(allCompanies);
    } catch (err) {
        console.error('Error fetching companies:', err);
    }
}

function renderCompanies(companies) {
    const grid = document.getElementById('companies-grid');
    const empty = document.getElementById('empty-state');
    
    grid.innerHTML = '';

    if (companies.length === 0) {
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer';
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="text-xl font-semibold">${company.name}</h3>
                <span class="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-3xl">${company.location}</span>
            </div>
            <p class="mt-4 text-slate-600 text-sm line-clamp-3">${company.description}</p>
            <div class="mt-6 text-sky-600 text-sm font-medium flex items-center">
                View Details 
                <span class="ml-auto text-xl">→</span>
            </div>
        `;
        card.onclick = () => showCompanyDetail(company);
        grid.appendChild(card);
    });
}

function showCompanyDetail(company) {
    document.getElementById('modal-name').textContent = company.name;
    document.getElementById('modal-location').textContent = company.location;
    document.getElementById('modal-desc').textContent = company.description;
    document.getElementById('modal-website').href = company.website;
    
    document.getElementById('view-modal').classList.remove('hidden');
    document.getElementById('view-modal').classList.add('flex');
}

function hideViewModal() {
    document.getElementById('view-modal').classList.add('hidden');
    document.getElementById('view-modal').classList.remove('flex');
}

async function handleAddCompany(e) {
    e.preventDefault();

    const newCompany = {
        name: document.getElementById('add-name').value,
        location: document.getElementById('add-location').value,
        description: document.getElementById('add-description').value,
        website: document.getElementById('add-website').value
    };

    try {
        const res = await fetch('/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCompany)
        });

        if (res.ok) {
            const addedCompany = await res.json();
            allCompanies.unshift(addedCompany);
            renderCompanies(allCompanies);
            hideAddModal();
            alert('Company added successfully!');
        }
    } catch (err) {
        console.error(err);
        alert('Failed to add company');
    }
}

function showAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
    document.getElementById('add-modal').classList.add('flex');
    document.getElementById('add-form').reset();
}

function hideAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
    document.getElementById('add-modal').classList.remove('flex');
}

function performSearch() {
    const term = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!term) {
        renderCompanies(allCompanies);
        return;
    }

    const filtered = allCompanies.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );

    renderCompanies(filtered);
}

window.onload = () => {
    fetchCompanies();
};
