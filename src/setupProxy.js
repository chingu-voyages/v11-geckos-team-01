const httpProxyMiddleware = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    httpProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true
    })
  );

  app.use(
    '/auth',
    httpProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true
    })
  );
};
