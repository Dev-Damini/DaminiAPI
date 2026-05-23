/**
 * Daminī API — Backend Proxy Layer
 * Node.js / Express server that silently bridges upstream scraped sources.
 * All upstream identities are hidden from the client at all times.
 */

const express = require('express');
const cors    = require('cors');
const axios   = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// ─── Hidden Upstream Sources ──────────────────────────────────────────────────
const SOURCE_OMEGA = 'https://omegatech-api.dixonomega.tech';
const SOURCE_CYRIL = 'https://apis.davidcyril.name.ng';

// Shared axios config — browser-like headers to avoid upstream rejections
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const axiosOpts = { timeout: 20000, headers: { 'User-Agent': UA, Accept: 'application/json, */*' } };

// ─── Utility: sanitise upstream response ─────────────────────────────────────
// Prevents raw HTML error pages from leaking to the client.
function safeData(data, fallback) {
  if (typeof data === 'string' && data.trim().startsWith('<')) {
    return fallback;
  }
  return data;
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'Daminī Proxy Layer', endpoints: 14 });
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 1 — AUDIO & SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/ai/tts', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/tts`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'TTS Engine unhandled exception' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'TTS Engine unhandled exception' });
  }
});

app.get('/api/ai/text2speech-v3', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/text2speech-v3`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Premium Voice Engine disconnected' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Premium Voice Engine disconnected' });
  }
});

app.get('/api/Search/Spotify', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/Spotify`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Search index unreachable' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Search index unreachable' });
  }
});

app.get('/api/Search/soundcloud', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/soundcloud`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'SoundCloud bridge failure' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'SoundCloud bridge failure' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 2 — INTELLIGENCE & CONVERSATION
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/ai/Ai-research', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/Ai-research`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Research node drop' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Research node drop' });
  }
});

app.get('/blackbox', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/blackbox`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Computational frame missing' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Computational frame missing' });
  }
});

app.get('/metaai', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/metaai`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Core LLM instance array fault' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Core LLM instance array fault' });
  }
});

app.get('/perplexity', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/perplexity`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Search optimization parsing crash' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Search optimization parsing crash' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 3 — GENERATIVE CREATIVE
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/mubert', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/mubert`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Audio composition node down' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Audio composition node down' });
  }
});

app.get('/writecream', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/writecream`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Canvas generation out of bounds' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Canvas generation out of bounds' });
  }
});

app.get('/api/Maker/fake-tweet', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Maker/fake-tweet`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Graphic render buffer mismatch' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Graphic render buffer mismatch' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 4 — ANIME DATA EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/anime-schedule', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/anime-schedule`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Schedule parsing timeout' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Schedule parsing timeout' });
  }
});

app.get('/anime-character', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/anime-character`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Character registry query fault' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Character registry query fault' });
  }
});

app.get('/anime', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}/anime`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Catalog engine lookup failure' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Catalog engine lookup failure' });
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, status: 404, error: 'Route not found on proxy layer' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Daminī Proxy] Active on port ${PORT}`));
