const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Replace this with the target server URL
const targetUrl = 'https://api.backpack.exchange';

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    next();
});

// Health check for uptime pings — must be registered before the proxy
// middleware so it isn't forwarded to Backpack. Express answers HEAD
// requests to GET routes with headers only (no body).
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true
}));

// Render assigns the port via env var; 3000 is the local fallback
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
