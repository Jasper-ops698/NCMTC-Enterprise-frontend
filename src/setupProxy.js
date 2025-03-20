const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      timeout: 30000, // Increase timeout to 30 seconds
      proxyTimeout: 30000,
      onProxyReq: (proxyReq, req, res) => {
        // Log the outgoing request
        console.log(`[Proxy] ${req.method} ${req.path}`);
        
        // Log headers
        console.log('[Proxy] Request Headers:', req.headers);
        
        if (req.body) {
          console.log('[Proxy] Request Body:', req.body);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log the response
        console.log(`[Proxy] Response from backend: ${proxyRes.statusCode}`);
        console.log('[Proxy] Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Error:', err);
        console.error('[Proxy] Error Stack:', err.stack);
        
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        
        const errorMessage = {
          error: 'Proxy Error',
          message: err.message,
          code: err.code,
          details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        };
        
        res.end(JSON.stringify(errorMessage));
      },
      // Additional configurations
      ws: true, // Enable WebSocket proxying
      xfwd: true, // Add x-forward headers
      logLevel: 'debug'
    })
  );
};
