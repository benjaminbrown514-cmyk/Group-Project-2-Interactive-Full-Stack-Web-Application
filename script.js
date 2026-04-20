let allCompanies = [];

async function fetchCompanies() {
    try {
        const res = await fetch('/api/companies');
        allCompanies = await res.json();
        renderCompanies(allCompanies);
    } catch (e) {
        console.error("Failed to load companies", e);
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
        const div = document.createElement('div');
        div.className = 'card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="font-semibold text-xl">${company.name}</h3>
                <span class="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">${company.location}</span>
            </div>
            <p class="mt-4 text-slate-600 line-clamp-3">${company.description}</p>
            <div class="mt-6 text-sky-600 text-sm font-medium">View Details →</div>
        `;
        div.onclick = () => showCompanyDetail(company);
        grid.appendChild(div);
    });
}

function showCompanyDetail(company) {
    document.getElementById('modal-name').textContent = company.name;
    document.getElementById('modal-location').textContent = company.location;
    document.getElementById('modal-description').textContent = company.description;
    document.getElementById('modal-website').href = company.website;

    document.getElementById('view-modal').classList.remove('hidden');
    document.getElementById('view-modal').classList.add('flex');
}

function hideViewModal() {
    const modal = document.getElementById('view-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function handleAddCompany(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⟳</span>
        Adding...
    `;

    const newCompany = {
        name: document.getElementById('add-name').value.trim(),
        location: document.getElementById('add-location').value.trim(),
        description: document.getElementById('add-description').value.trim(),
        website: document.getElementById('add-website').value.trim()
    };

    if (!newCompany.name || !newCompany.location || !newCompany.description || !newCompany.website) {
        alert("Please fill out all fields");
        resetButton();
        return;
    }

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
            alert(`✅ ${addedCompany.name} was added successfully!`);
        } else {
            const errorData = await res.json();
            alert(errorData.error || "Failed to add company");
        }
    } catch (err) {
        console.error("Add company error:", err);
        alert("Could not connect to server. Make sure 'npm run dev' is running.");
    } finally {
        resetButton();
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function showAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
    document.getElementById('add-modal').classList.add('flex');
    document.getElementById('add-form').reset();
}

function hideAddModal() {
    const modal = document.getElementById('add-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
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

window.onload = fetchCompanies;
