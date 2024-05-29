const http = require('http');

module.exports = (req, res) => {
  const { method, headers, body, url } = req;
  const proxyUrl = `http://fargat-farga-opbzm5amp8ir-1656924029.us-east-1.elb.amazonaws.com${url.replace('/api', '')}`;

  const options = {
    method,
    headers: {
      ...headers,
      host: 'fargat-farga-opbzm5amp8ir-1656924029.us-east-1.elb.amazonaws.com'
    }
  };

  const proxyReq = http.request(proxyUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  if (body) {
    proxyReq.write(body);
  }

  proxyReq.end();
};
