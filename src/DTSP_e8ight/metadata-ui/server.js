const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8084;
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:54002';
const FDT_SERVICE_URL = process.env.FDT_SERVICE_URL || 'http://localhost:50038';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:54009';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMSIsImF1dGgiOiJBRE1JTiIsImV4cCI6MjAwMDE2MzQ2NH0.9Ed_V3BRvA9ASU8tcFxS7Wrx16ACYV5Chn3MHb_6TUlIhTW8uPNG2d6ocNCyIBp4DNU84VqxCatLnzJc0_7cCA';

// ── API Proxy: /api/manager → Gateway /ndxpro/v1/manager ──
app.use('/api/manager', createProxyMiddleware({
    target: GATEWAY_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/manager': '/ndxpro/v1/manager' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${AUTH_TOKEN}`);
        if (!proxyReq.getHeader('Content-Type')) {
            proxyReq.setHeader('Content-Type', 'application/json;charset=UTF-8');
        }
    },
}));

app.use('/api/service', createProxyMiddleware({
    target: GATEWAY_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/service': '/ndxpro/v1/service' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${AUTH_TOKEN}`);
    },
}));

// ── API Proxy: /api/fdt → FDT Service (port 50038) ──
app.use('/api/fdt/health', createProxyMiddleware({
    target: FDT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/fdt/health': '/' },
}));

app.use('/api/fdt/api-docs', createProxyMiddleware({
    target: FDT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/fdt/api-docs': '/v3/api-docs' },
}));

app.use('/api/fdt/tour', createProxyMiddleware({
    target: FDT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/fdt/tour': '/api/fdt/tour' },
}));

// ── API Proxy: /api/auth → Data Auth Service (port 54009) directly ──
app.use('/api/auth-docs', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth-docs': '/v3/api-docs' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${AUTH_TOKEN}`);
    },
}));

app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/ndxpro/v1/auth' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${AUTH_TOKEN}`);
        if (!proxyReq.getHeader('Content-Type')) {
            proxyReq.setHeader('Content-Type', 'application/json;charset=UTF-8');
        }
    },
}));

// ── Static assets ──
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// ── Login pass-through (mimics original service) ──
app.get('/loginpass', (req, res) => {
    const to = req.query.to;
    if (to) return res.redirect(to);
    res.status(400).send('Missing "to" parameter');
});

// ── Page routes ──
app.get('/meta/exsearch/list', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/meta/exmanage/dt', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

app.get('/meta/exmedatagraph', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'graph.html'));
});

// ── New page routes: Union Object Sync Engine & Verification Data ──
app.get('/sync-engine', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sync-engine.html'));
});

app.get('/verification', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verification.html'));
});

app.get('/predictor', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'predictor.html'));
});

app.get('/discrete-simulator', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'discrete-simulator.html'));
});

app.get('/jeju-api', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'jeju-api.html'));
});

// ── Health check ──
app.get('/', (_req, res) => {
    res.send('OK — Metadata UI Service is running');
});

app.listen(PORT, () => {
    console.log(`✅ Metadata UI Service running at http://localhost:${PORT}`);
    console.log(`   → Search:       http://localhost:${PORT}/meta/exsearch/list`);
    console.log(`   → Manage:       http://localhost:${PORT}/meta/exmanage/dt`);
    console.log(`   → Graph:        http://localhost:${PORT}/meta/exmedatagraph`);
    console.log(`   → Sync Engine:  http://localhost:${PORT}/sync-engine`);
    console.log(`   → Verification: http://localhost:${PORT}/verification`);
    console.log(`   → Predictor:    http://localhost:${PORT}/predictor`);
    console.log(`   → Discrete Sim: http://localhost:${PORT}/discrete-simulator`);
    console.log(`   → Jeju API:     http://localhost:${PORT}/jeju-api`);
    console.log(`   → Gateway:      ${GATEWAY_URL}`);
    console.log(`   → FDT Service:  ${FDT_SERVICE_URL}`);
});
