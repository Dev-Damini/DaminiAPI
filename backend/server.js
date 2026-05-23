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

// ─── Utility: Scrub Upstream Branding & Handle HTML Crashes ───────────────────
function cleanBranding(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map(item => cleanBranding(item));
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // If value is a string, scrub target third-party text
    if (typeof value === 'string') {
      let temp = value
        .replace(/OMEGATECH/gi, 'Daminī API Engine')
        .replace(/@Omegatech-01/gi, '@DaminiCodesphere')
        .replace(/David Cyril/gi, 'Dev Daminī');
      cleaned[key] = temp;
    } else if (typeof value === 'object') {
      cleaned[key] = cleanBranding(value);
    } else {
      cleaned[key] = value;
    }
  }

  // Force your custom engine signatures
  if (cleaned.hasOwnProperty('credit')) cleaned.credit = 'Daminī API Engine';
  if (cleaned.hasOwnProperty('attribution')) cleaned.attribution = '@DaminiCodesphere';
  if (cleaned.hasOwnProperty('creator')) cleaned.creator = 'Dev Daminī';
  
  return cleaned;
}

function safeData(data, fallback) {
  // Prevents raw HTML error pages from leaking to the client.
  if (typeof data === 'string' && data.trim().startsWith('<')) {
    return fallback;
  }
  return cleanBranding(data);
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'Daminī Proxy Layer', developer: 'Dev Daminī', endpoints: 15 });
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 1 — AUDIO & SEARCH (OMEGATECH ROOTED)
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Gemini TTS & Anime Voices (Corrected Upstream Path & Fallbacks)
app.get('/api/ai/tts', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/Gemini-tts`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'TTS Engine/Anime Voice disconnected' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'TTS Engine/Anime Voice disconnected' });
  }
});

// 2. Live3D TTS V3 
app.get('/api/ai/text2speech-v3', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/text2speech-v3`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Premium Voice Engine disconnected' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Premium Voice Engine disconnected' });
  }
});

// 3. Spotify Search
app.get('/api/Search/Spotify', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/Spotify`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Search index unreachable' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Search index unreachable' });
  }
});

// 4. SoundCloud Search
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
//   CATEGORY 2 — INTELLIGENCE, RESEARCH & DOWNLOADS (DAVID CYRIL ROOTED)
// ═══════════════════════════════════════════════════════════════════════════════

// 5. AI Research / WebPilot 
app.get('/api/ai/Ai-research', async (req, res) => {
  try {
    const frontendQuery = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/webpilot`, { 
      ...axiosOpts, 
      params: { query: frontendQuery } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'WebPilot research engine node down' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'WebPilot research engine node down' });
  }
});

// 6. Blackbox AI 
app.get('/blackbox', async (req, res) => {
  try {
    const frontendQuery = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/blackbox`, { 
      ...axiosOpts, 
      params: { q: frontendQuery } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Computational stream parsing crash' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Computational stream parsing crash' });
  }
});

// 7. Llama Meta AI
app.get('/metaai', async (req, res) => {
  try {
    const frontendQuery = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/metaai`, { 
      ...axiosOpts, 
      params: { q: frontendQuery } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Core LLM instance handling fault' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Core LLM instance handling fault' });
  }
});

// 8. Perplexity Search (Parameter matching fix)
app.get('/perplexity', async (req, res) => {
  try {
    const frontendQuery = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/perplexity`, { 
      ...axiosOpts, 
      params: { query: frontendQuery } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Search optimization parsing crash' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Search optimization parsing crash' });
  }
});

// 9. Media & Music Video Downloader YTV3
app.get('/api/download/ytv3', async (req, res) => {
  try {
    const targetUrl = req.query.url || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/download/ytv3`, { 
      ...axiosOpts, 
      params: { url: targetUrl } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Media downstream link retrieval crash' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Media downstream link retrieval crash' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 3 — GENERATIVE CREATIVE & IMAGING
// ═══════════════════════════════════════════════════════════════════════════════

// 10. Advanced Mubert AI Create Engine
app.get('/mubert', async (req, res) => {
  try {
    const params = {
      prompt: req.query.prompt || req.query.q || 'lofi chill jazz beats',
      duration: req.query.duration || 60,
      intensity: req.query.intensity || 'high',
      format: req.query.format || 'mp3'
    };
    const upstream = await axios.get(`${SOURCE_CYRIL}/aimusic/mubert/create`, { ...axiosOpts, params });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Audio composition node down' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Audio composition node down' });
  }
});

// 11. Advanced Suno AI Create Engine (Fixes 404 Layout routes)
app.get('/api/ai/suno', async (req, res) => {
  try {
    const params = {
      prompt: req.query.prompt || req.query.q || '',
      lyrics: req.query.lyrics || '',
      tags: req.query.tags || '',
      title: req.query.title || '',
      instrumental: req.query.instrumental || 'false',
      model: req.query.model || 'chirp-v3-5'
    };
    const upstream = await axios.get(`${SOURCE_CYRIL}/aimusic/suno/create`, { ...axiosOpts, params });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Suno track generation failure' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Suno track generation failure' });
  }
});

// 12. Writecream & Whitecream Text-To-Image Engine
app.get('/writecream', async (req, res) => {
  try {
    const textPrompt = req.query.text || req.query.prompt || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/writecream`, { 
      ...axiosOpts, 
      params: { text: textPrompt } 
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Canvas image generation out of bounds' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Canvas image generation out of bounds' });
  }
});

// 13. Flux Pro / damini-image (Injects custom "Api-Key" headers)
app.get('/api/ai/damini-image', async (req, res) => {
  try {
    const textPrompt = req.query.prompt || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/fluxpro`, {
      timeout: 25000,
      headers: { 
        'User-Agent': UA,
        'Api-Key': 'flux-pro-secure-token-global', // Upstream authorized validation header
        Accept: 'application/json, */*'
      },
      params: { prompt: textPrompt }
    });
    res.status(200).json(safeData(upstream.data, { success: false, error: 'Flux Pro base engine dropped connection' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Flux Pro base engine dropped connection' });
  }
});

// 14. Fake Tweet Engine (Captures false status inside code 200 payload)
app.get('/api/Maker/fake-tweet', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Maker/fake-tweet`, { ...axiosOpts, params: req.query });
    
    // Intercept upstream payload returns that have status: false hidden inside status 200
    if (upstream.data && upstream.data.status === false) {
      return res.status(200).json({
        statusCode: 200,
        status: false,
        error: "Failed to generate or upload fake tweet image.",
        credit: "Daminī API Engine",
        timestamp: new Date().toISOString(),
        attribution: "@DaminiCodesphere"
      });
    }

    res.status(200).json(safeData(upstream.data, { success: false, error: 'Graphic render buffer mismatch' }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: 'Graphic render buffer mismatch' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 4 — ANIME DATA EXTRACTION 
// ═══════════════════════════════════════════════════════════════════════════════

// 15. Anime Sub-Router Handler
app.get(['/anime-schedule', '/anime-character', '/anime'], async (req, res) => {
  let subPath = '';
  let fallbackMsg = '';

  if (req.path === '/anime-schedule') {
    subPath = '/anime/schedule';
    fallbackMsg = 'Schedule parsing timeout';
  } else if (req.path === '/anime-character') {
    subPath = '/anime/characters';
    fallbackMsg = 'Character registry query fault';
  } else {
    subPath = '/anime/search';
    fallbackMsg = 'Catalog engine lookup failure';
  }

  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}${subPath}`, { ...axiosOpts, params: req.query });
    res.status(200).json(safeData(upstream.data, { success: false, error: fallbackMsg }));
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ success: false, status, error: fallbackMsg });
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, status: 404, error: 'Route not found on proxy layer' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Daminī Proxy] Active on port ${PORT}`));
