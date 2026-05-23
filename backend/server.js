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

// Shared axios config
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const axiosOpts = { timeout: 25000, headers: { 'User-Agent': UA, Accept: 'application/json, */*' } };

// ─── Ultimate Zero-Leak Ironclad Firewall ────────────────────────────────────
function scrubAndSanitise(inputData, fallbackMessage = 'Engine operational exception') {
  if (!inputData) return { success: false, error: fallbackMessage };

  // Convert to string to safely parse out hidden deep nesting names or HTML strings
  let serialized = '';
  if (typeof inputData === 'object') {
    try {
      serialized = JSON.stringify(inputData);
    } catch (e) {
      serialized = String(inputData);
    }
  } else {
    serialized = String(inputData);
  }

  // Direct, absolute blocking of any incoming HTML content strings
  if (serialized.trim().startsWith('<') || serialized.includes('<!DOCTYPE html>') || serialized.includes('<html')) {
    return { 
      success: false, 
      status: 502, 
      error: fallbackMessage,
      provider: "Daminī API Engine",
      owner: "Dev Daminī"
    };
  }

  // Hard global regex sweep to strip ALL third-party traces across strings or strings-in-json
  serialized = serialized
    .replace(/OMEGATECH/gi, 'Daminī API Engine')
    .replace(/@Omegatech-01/gi, '@DaminiCodesphere')
    .replace(/OmegaTech API/gi, 'Daminī API Engine')
    .replace(/David Cyril/gi, 'Dev Daminī')
    .replace(/dixonomega/gi, 'daminicodesphere');

  try {
    const parsed = JSON.parse(serialized);
    
    // Double-check nested fields for residual HTML errors
    if (parsed.error && (String(parsed.error).includes('<') || String(parsed.error).includes('404'))) {
      parsed.error = fallbackMessage;
    }
    if (parsed.response_data?.result && String(parsed.response_data.result).includes('<')) {
      parsed.response_data.result = fallbackMessage;
    }

    return parsed;
  } catch (e) {
    // If it's a string that can't be parsed as JSON, make sure it doesn't leak raw text
    if (serialized.includes('error') || serialized.includes('failed')) {
      return { success: false, error: fallbackMessage };
    }
    return { success: true, result: serialized };
  }
}

// Global Express Catch Helper to keep errors branded
function sendCleanError(res, err, defaultMsg) {
  const status = err.response?.status || 500;
  const rawData = err.response?.data;
  
  if (rawData) {
    return res.status(status).json(scrubAndSanitise(rawData, defaultMsg));
  }
  
  res.status(status).json({
    success: false,
    status: status,
    error: defaultMsg,
    provider: "Daminī API Engine",
    owner: "Dev Daminī"
  });
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'Daminī Proxy Layer', developer: 'Dev Daminī', endpoints: 15 });
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 1 — AUDIO & TTS LAYER
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Gemini TTS & Anime / ElevenLabs Core Fix
app.get('/api/ai/tts', async (req, res) => {
  try {
    const text = req.query.text || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/Gemini-tts`, { 
      ...axiosOpts, 
      params: { text: text } 
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'TTS Generation engine down'));
  } catch (err) {
    sendCleanError(res, err, 'TTS Generation engine down');
  }
});

// 2. Live3D TTS V3 
app.get('/api/ai/text2speech-v3', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/text2speech-v3`, { ...axiosOpts, params: req.query });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Premium Voice Engine disconnected'));
  } catch (err) {
    sendCleanError(res, err, 'Premium Voice Engine disconnected');
  }
});

// 3. Spotify Search Index
app.get('/api/Search/Spotify', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/Spotify`, { ...axiosOpts, params: req.query });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Search index unreachable'));
  } catch (err) {
    sendCleanError(res, err, 'Search index unreachable');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 2 — ADVANCED RESEARCH, CHAT & AGENTS (CYRIL RE-ROUTED PATHS)
// ═══════════════════════════════════════════════════════════════════════════════

// 4. WebPilot Dynamic Web Search (Pipes parameters natively to upstream source)
app.get('/api/ai/Ai-research', async (req, res) => {
  try {
    const queryTerm = req.query.query || req.query.q || req.query.text || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/webpilot`, { 
      ...axiosOpts, 
      params: { query: queryTerm }
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'WebPilot research engine node down'));
  } catch (err) {
    sendCleanError(res, err, 'WebPilot research engine node down');
  }
});

// 5. Blackbox Intelligence Core
app.get('/blackbox', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/blackbox`, { 
      ...axiosOpts, 
      params: { text: queryTerm } 
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Computational stream parsing crash'));
  } catch (err) {
    sendCleanError(res, err, 'Computational stream parsing crash');
  }
});

// 6. Llama Meta AI System Route
app.get('/metaai', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/metaai`, { 
      ...axiosOpts, 
      params: { text: queryTerm } 
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Core LLM instance handling fault'));
  } catch (err) {
    sendCleanError(res, err, 'Core LLM instance handling fault');
  }
});

// 7. Perplexity Conversational Search Engine
app.get('/perplexity', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/perplexity`, { 
      ...axiosOpts, 
      params: { text: queryTerm } 
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Search optimization parsing crash'));
  } catch (err) {
    sendCleanError(res, err, 'Search optimization parsing crash');
  }
});

// 8. Writecream AI Text Engine (PERMANENTLY MOVED: Integrated cleanly into /api/ai section)
app.get('/api/ai/writecream', async (req, res) => {
  try {
    const textPrompt = req.query.text || req.query.prompt || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/writecream`, { 
      ...axiosOpts, 
      params: { text: textPrompt } 
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Writecream text processing engine error'));
  } catch (err) {
    sendCleanError(res, err, 'Writecream text processing engine error');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 3 — MUSIC & HIGH-TIER IMAGE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

// 9. Suno Track Engine Creator
app.get('/api/ai/suno', async (req, res) => {
  try {
    const params = {
      query: req.query.prompt || req.query.q || '',
      model: req.query.model || 'chirp-v3-5'
    };
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/suno`, { ...axiosOpts, params });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Suno track generation failure'));
  } catch (err) {
    sendCleanError(res, err, 'Suno track generation failure');
  }
});

// 10. Flux Pro / damini-image
app.get('/api/ai/damini-image', async (req, res) => {
  try {
    const imagePrompt = req.query.prompt || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_CYRIL}/ai/fluxpro`, {
      timeout: 28000,
      headers: { 
        'User-Agent': UA,
        'Api-Key': 'flux-pro-secure-token-global',
        Accept: 'application/json, */*'
      },
      params: { text: imagePrompt }
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Flux Pro base engine connection dropped'));
  } catch (err) {
    sendCleanError(res, err, 'Flux Pro base engine connection dropped');
  }
});

// 11. Fake Tweet Generation Render Pipeline
app.get('/api/Maker/fake-tweet', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Maker/fake-tweet`, { ...axiosOpts, params: req.query });
    
    if (upstream.data && (upstream.data.status === false || upstream.data.error)) {
      return res.status(200).json({
        statusCode: 200,
        status: false,
        error: "Failed to generate or upload fake tweet image.",
        credit: "Daminī API Engine",
        timestamp: new Date().toISOString(),
        attribution: "@DaminiCodesphere"
      });
    }

    res.status(200).json(scrubAndSanitise(upstream.data, 'Graphic render buffer mismatch'));
  } catch (err) {
    sendCleanError(res, err, 'Graphic render buffer mismatch');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 4 — ANIME EXTRACTOR AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

// 12. Combined Dynamic Anime Router Paths
app.get(['/anime-schedule', '/anime-character', '/anime'], async (req, res) => {
  let subPath = '';
  let fallbackMsg = '';
  let params = {};

  if (req.path.includes('schedule')) {
    subPath = '/anime/schedule';
    fallbackMsg = 'Schedule parsing timeout';
    params = req.query;
  } else if (req.path.includes('character')) {
    subPath = '/anime/characters'; // Formatted strictly to upstream database location structure
    fallbackMsg = 'Character registry query fault';
    params = { id: req.query.id || req.query.q || '' };
  } else {
    subPath = '/anime/search';
    fallbackMsg = 'Catalog engine lookup failure';
    params = { q: req.query.q || req.query.query || '' };
  }

  try {
    const upstream = await axios.get(`${SOURCE_CYRIL}${subPath}`, { ...axiosOpts, params });
    res.status(200).json(scrubAndSanitise(upstream.data, fallbackMsg));
  } catch (err) {
    sendCleanError(res, err, fallbackMsg);
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, status: 404, error: 'Route not found on proxy layer' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Daminī Proxy] Active on port ${PORT}`));
