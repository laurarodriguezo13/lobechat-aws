const http = require('http');
const https = require('https');

const TARGET_HOST = 'openrouter.ai';
const MAX_TOKENS_CAP = 8000;

http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    let body = Buffer.concat(chunks);
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (ct.includes('application/json') && body.length) {
      try {
        const obj = JSON.parse(body.toString('utf8'));
        // Cap max_tokens so OpenRouter credit check always passes
        if (obj.max_tokens === undefined || obj.max_tokens > MAX_TOKENS_CAP) {
          obj.max_tokens = MAX_TOKENS_CAP;
        }
        body = Buffer.from(JSON.stringify(obj), 'utf8');
      } catch (e) {}
    }
    const headers = Object.assign({}, req.headers, {
      host: TARGET_HOST,
      'content-length': body.length,
    });
    delete headers['content-encoding'];
    const outReq = https.request({
      hostname: TARGET_HOST,
      port: 443,
      path: req.url,
      method: req.method,
      headers,
    }, outRes => {
      res.writeHead(outRes.statusCode, outRes.headers);
      outRes.pipe(res);
    });
    outReq.on('error', e => { console.error('proxy error', e.message); res.destroy(); });
    outReq.write(body);
    outReq.end();
  });
}).listen(8080, () => console.log('proxy listening :8080 -> openrouter.ai (max_tokens capped at', MAX_TOKENS_CAP, ')'));
