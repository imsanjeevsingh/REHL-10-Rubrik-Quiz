
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Enable JSON parsing if needed for future API extensions
app.use(express.json());

// Serve static files from the 'dist' directory created by Vite
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Send all unknown GET requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SYS] Vepsun Hypervisor Server active on port ${PORT}`);
  console.log(`[SYS] Environment: ${process.env.NODE_ENV || 'production'}`);
});
