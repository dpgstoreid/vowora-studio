const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const INVITATIONS_FILE = path.join(ROOT_DIR, 'invitations.json');
const ORDERS_FILE = path.join(ROOT_DIR, 'order-automation', 'orders.json');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'template-undangan');

// Helper JSON read/write
function readJSON(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. API: GET /api/stats
  if (method === 'GET' && pathname === '/api/stats') {
    const orders = readJSON(ORDERS_FILE, []);
    const invitations = readJSON(INVITATIONS_FILE, []);
    
    let totalOmset = 0;
    let totalMasuk = 0;
    let pendingDeadline = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    orders.forEach(o => {
      totalOmset += (o.biaya_total || 0);
      totalMasuk += (o.dp_dibayar || 0);
      if (o.deadline_draft && o.status_pengerjaan !== 'Selesai') {
        const d = new Date(o.deadline_draft);
        d.setHours(0,0,0,0);
        const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 2) pendingDeadline++;
      }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalInvitations: invitations.length,
      totalOrders: orders.length,
      totalOmset,
      totalMasuk,
      piutang: totalOmset - totalMasuk,
      urgentDeadlines: pendingDeadline
    }));
    return;
  }

  // 2. API: INVITATIONS CRUD
  if (pathname === '/api/invitations') {
    if (method === 'GET') {
      const data = readJSON(INVITATIONS_FILE, []);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return;
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newInv = JSON.parse(body);
          if (!newInv.slug) {
            newInv.slug = `${newInv.mempelai.pria.panggilan.toLowerCase()}-${newInv.mempelai.wanita.panggilan.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');
          }
          const list = readJSON(INVITATIONS_FILE, []);
          const existingIdx = list.findIndex(i => i.slug === newInv.slug);
          newInv.updatedAt = new Date().toISOString();
          
          if (existingIdx >= 0) {
            list[existingIdx] = { ...list[existingIdx], ...newInv };
          } else {
            newInv.createdAt = new Date().toISOString();
            list.unshift(newInv);
          }
          
          writeJSON(INVITATIONS_FILE, list);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, invitation: newInv }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  // DELETE /api/invitations/:slug
  if (method === 'DELETE' && pathname.startsWith('/api/invitations/')) {
    const slug = pathname.replace('/api/invitations/', '');
    const list = readJSON(INVITATIONS_FILE, []);
    const filtered = list.filter(i => i.slug !== slug);
    writeJSON(INVITATIONS_FILE, filtered);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 3. API: ORDERS CRUD
  if (pathname === '/api/orders') {
    if (method === 'GET') {
      const orders = readJSON(ORDERS_FILE, []);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(orders));
      return;
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newOrder = JSON.parse(body);
          const orders = readJSON(ORDERS_FILE, []);
          if (!newOrder.order_id) {
            newOrder.order_id = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
          }
          const existingIdx = orders.findIndex(o => o.order_id === newOrder.order_id);
          if (existingIdx >= 0) {
            orders[existingIdx] = { ...orders[existingIdx], ...newOrder };
          } else {
            orders.unshift(newOrder);
          }
          writeJSON(ORDERS_FILE, orders);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, order: newOrder }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  // 4. PUBLIC WEDDING INVITATION VIEW: /u/:slug
  if (pathname.startsWith('/u/')) {
    const slug = pathname.replace('/u/', '').split('?')[0];
    const invitations = readJSON(INVITATIONS_FILE, []);
    const inv = invitations.find(i => i.slug === slug);

    if (!inv) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:sans-serif; text-align:center; padding:50px; background:#0b1120; color:#fff; min-height:100vh;">
          <h2 style="font-size:2rem; color:#d4af37;">Undangan Tidak Ditemukan</h2>
          <p style="color:#94a3b8;">Undangan dengan tautan <b>${slug}</b> belum terdaftar di DPGSTORE.ID.</p>
          <a href="/" style="display:inline-block; margin-top:20px; padding:10px 24px; background:#d4af37; color:#000; border-radius:12px; text-decoration:none; font-weight:bold;">Kembali ke Beranda DPGSTORE.ID</a>
        </div>
      `);
      return;
    }

    // Set default DPGSTORE.ID branding
    if (!inv.branding) {
      inv.branding = {
        namaBrand: "DPGSTORE.ID (Palugada Serba Ada)",
        linkBrand: "/",
        pesanFooter: "Crafted with love by"
      };
    }

    // Read base template and inject wedding data
    const templateHtmlPath = path.join(TEMPLATE_DIR, 'index.html');
    let html = fs.readFileSync(templateHtmlPath, 'utf8');

    // Inject data-theme on html tag
    const theme = inv.theme || 'gold';
    html = html.replace('<html lang="id">', `<html lang="id" data-theme="${theme}">`);

    // Replace config.js with inline config
    const injectedConfigScript = `<script>window.WEDDING_CONFIG = ${JSON.stringify(inv)};</script>`;
    html = html.replace('<script src="config.js"></script>', injectedConfigScript);
    
    // Fix asset paths
    html = html.replace('href="style.css"', 'href="/template/style.css"');
    html = html.replace('src="script.js"', 'src="/template/script.js"');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // 5. STATIC ASSETS: /template/*
  if (pathname.startsWith('/template/')) {
    const filename = pathname.replace('/template/', '');
    const filePath = path.join(TEMPLATE_DIR, filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // 6. ROUTING HALAMAN UTAMA:
  // - '/' -> Vowora Landing Page (public/landing.html)
  // - '/admin' atau '/studio' -> Creator & Order Studio (public/admin.html)
  let targetFile = null;
  if (pathname === '/') {
    targetFile = path.join(ROOT_DIR, 'public', 'landing.html');
  } else if (pathname === '/admin' || pathname === '/studio') {
    targetFile = path.join(ROOT_DIR, 'public', 'admin.html');
  } else {
    targetFile = path.join(ROOT_DIR, 'public', pathname);
  }
  
  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
    const ext = path.extname(targetFile);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    fs.createReadStream(targetFile).pipe(res);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🎉 VOWORA PLATFORM RESMI AKTIF!`);
    console.log(`  🌐 Website Utama Vowora : http://localhost:${PORT}`);
    console.log(`  🛠️ Studio Admin Creator : http://localhost:${PORT}/admin`);
    console.log(`======================================================\n`);
  });
}

module.exports = server;
