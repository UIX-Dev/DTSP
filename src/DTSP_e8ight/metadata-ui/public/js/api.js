/**
 * Metadata UI — Shared API Client
 * Proxied through /api/manager → Gateway /ndxpro/v1/manager
 */

const API_BASE = '/api/manager';

const api = {
    // ── Data Models ──
    async getDataModels({ curPage = 0, size = 25, word, isReady } = {}) {
        const params = new URLSearchParams({ curPage, size });
        if (word) params.set('word', word);
        if (isReady !== undefined && isReady !== '') params.set('isReady', isReady);
        const res = await fetch(`${API_BASE}/data-models?${params}`);
        if (!res.ok) throw new Error(`Failed to fetch data models: ${res.status}`);
        return res.json();
    },

    async getDataModel(id, version) {
        const params = version ? `?version=${version}` : '';
        const res = await fetch(`${API_BASE}/data-models/${encodeURIComponent(id)}${params}`);
        if (!res.ok) throw new Error(`Failed to fetch data model: ${res.status}`);
        return res.json();
    },

    async createDataModel(data) {
        const res = await fetch(`${API_BASE}/data-models`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to create data model: ${res.status}`);
        return res.text();
    },

    async updateDataModel(data) {
        const res = await fetch(`${API_BASE}/data-models`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to update data model: ${res.status}`);
        return res.text();
    },

    async deleteDataModel(id) {
        const res = await fetch(`${API_BASE}/data-models/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to delete data model: ${res.status}`);
        return res.text();
    },

    async checkDuplicateDataModel(id) {
        const res = await fetch(`${API_BASE}/data-models/check-duplicate/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`Failed to check duplicate: ${res.status}`);
        return res.json();
    },

    // ── Attributes ──
    async getAttributes({ curPage = 0, size = 25, word } = {}) {
        const params = new URLSearchParams({ curPage, size });
        if (word) params.set('word', word);
        const res = await fetch(`${API_BASE}/attributes?${params}`);
        if (!res.ok) throw new Error(`Failed to fetch attributes: ${res.status}`);
        return res.json();
    },

    async getAttribute(id) {
        const res = await fetch(`${API_BASE}/attributes/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`Failed to fetch attribute: ${res.status}`);
        return res.json();
    },

    async createAttribute(data) {
        const res = await fetch(`${API_BASE}/attributes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to create attribute: ${res.status}`);
        return res.text();
    },

    async updateAttribute(data) {
        const res = await fetch(`${API_BASE}/attributes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to update attribute: ${res.status}`);
        return res.text();
    },

    async deleteAttribute(id) {
        const res = await fetch(`${API_BASE}/attributes/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to delete attribute: ${res.status}`);
        return res.text();
    },

    // ── Contexts ──
    async getContexts() {
        const res = await fetch(`${API_BASE}/contexts`);
        if (!res.ok) throw new Error(`Failed to fetch contexts: ${res.status}`);
        return res.json();
    },

    async getContext(url) {
        const res = await fetch(`${API_BASE}/context?contextUrl=${encodeURIComponent(url)}&full=true`);
        if (!res.ok) throw new Error(`Failed to fetch context: ${res.status}`);
        return res.json();
    },

    async createContext(data) {
        const res = await fetch(`${API_BASE}/contexts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to create context: ${res.status}`);
        return res.json();
    },

    async deleteContext(url) {
        const res = await fetch(`${API_BASE}/contexts?contextUrl=${encodeURIComponent(url)}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to delete context: ${res.status}`);
        return res.text();
    },

    // ── Attribute Schemas ──
    async getAttributeSchemas({ curPage = 0, size = 25 } = {}) {
        const params = new URLSearchParams({ curPage, size });
        const res = await fetch(`${API_BASE}/attribute-schemata?${params}`);
        if (!res.ok) throw new Error(`Failed to fetch attribute schemas: ${res.status}`);
        return res.json();
    },
};

// ── Toast Notifications ──
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Modal Helpers ──
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ── Date Formatting ──
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// ── Truncate Text ──
function truncate(str, len = 50) {
    if (!str) return '-';
    return str.length > len ? str.substring(0, len) + '…' : str;
}
