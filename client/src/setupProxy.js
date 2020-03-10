const httpProxyMiddleware = require('http-proxy-middleware');

// THIS FILE IS REGISTERED AUTOMATICALLY CREATE-REACT-APP

// https://create-react-app.dev/docs/proxying-api-requests-in-development/

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
