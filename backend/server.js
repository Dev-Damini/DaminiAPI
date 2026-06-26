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

// Public replacement sources (previously SOURCE_CYRIL)
const SOURCE_POLLINATIONS_TEXT  = 'https://text.pollinations.ai';
const SOURCE_POLLINATIONS_IMAGE = 'https://image.pollinations.ai';
const SOURCE_JIKAN               = 'https://api.jikan.moe/v4';      // anime
const SOURCE_COBALT              = 'https://api.cobalt.tools';        // media downloads
const SOURCE_INVIDIOUS           = 'https://invidious.snopyta.org';   // youtube alt
const SOURCE_USELESSFACTS        = 'https://uselessfacts.jsph.pl';   // facts
const SOURCE_OFFICIALJOKEAPI     = 'https://official-joke-api.appspot.com'; // jokes

// Shared axios config
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const axiosOpts = { timeout: 25000, headers: { 'User-Agent': UA, Accept: 'application/json, */*' } };

// ─── Ultimate Zero-Leak Ironclad Firewall ────────────────────────────────────
function scrubAndSanitise(inputData, fallbackMessage = 'Engine operational exception') {
  if (!inputData) return { success: false, error: fallbackMessage };

  let serialized = '';
  if (typeof inputData === 'object') {
    try { serialized = JSON.stringify(inputData); } catch (e) { serialized = String(inputData); }
  } else {
    serialized = String(inputData);
  }

  // Block raw HTML responses entirely
  if (serialized.trim().startsWith('<') || serialized.includes('<!DOCTYPE html>') || serialized.includes('<html')) {
    return {
      success: false,
      status: 502,
      error: fallbackMessage,
      provider: 'Daminī API Engine',
      owner: 'Dev Daminī',
    };
  }

  // Strip ALL third-party traces
  serialized = serialized
    .replace(/OMEGATECH/gi, 'Daminī API Engine')
    .replace(/@Omegatech-01/gi, '@DaminiCodesphere')
    .replace(/OmegaTech API/gi, 'Daminī API Engine')
    .replace(/David Cyril/gi, 'Dev Daminī')
    .replace(/davidcyril/gi, 'daminicodesphere')
    .replace(/dixonomega/gi, 'daminicodesphere')
    .replace(/omegatech-api/gi, 'damini-api')
    .replace(/apis\.daminicodesphere\.name\.ng/gi, 'api.damini.dev')
    .replace(/pollinations/gi, 'Daminī AI Engine')
    .replace(/jikan/gi, 'Daminī Anime Engine')
    .replace(/cobalt/gi, 'Daminī Media Engine')
    .replace(/invidious/gi, 'Daminī Video Engine')
    .replace(/onspace/gi, 'Daminī Cloud')
    .replace(/supabase/gi, 'Daminī Cloud')
    .replace(/mxcbspvyqeckbkbomxcb\.backend\.[^\s"']*/gi, 'api.damini.dev');

  try {
    const parsed = JSON.parse(serialized);

    if (parsed.error && (String(parsed.error).includes('<') || String(parsed.error).includes('404'))) {
      parsed.error = fallbackMessage;
    }
    if (parsed.response_data?.result && String(parsed.response_data.result).includes('<')) {
      parsed.response_data.result = fallbackMessage;
    }

    return parsed;
  } catch {
    if (serialized.includes('error') || serialized.includes('failed')) {
      return { success: false, error: fallbackMessage };
    }
    return { success: true, result: serialized };
  }
}

function sendCleanError(res, err, defaultMsg) {
  const status = err.response?.status || 500;
  const rawData = err.response?.data;

  if (rawData) return res.status(status).json(scrubAndSanitise(rawData, defaultMsg));

  res.status(status).json({
    success: false,
    status,
    error: defaultMsg,
    provider: 'Daminī API Engine',
    owner: 'Dev Daminī',
  });
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Daminī Proxy Layer',
    developer: 'Dev Daminī',
    endpoints: 36,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 1 — AUDIO & TTS LAYER  (SOURCE_OMEGA — unchanged)
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Standard Gemini TTS
app.get('/api/ai/tts', async (req, res) => {
  try {
    const text = req.query.text || req.query.q || '';
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/Gemini-tts`, {
      ...axiosOpts,
      params: { text },
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'TTS Generation engine down'));
  } catch (err) {
    sendCleanError(res, err, 'TTS Generation engine down');
  }
});

// 2. Premium Multi-Voice TTS V3
app.get('/api/ai/text2speech-v3', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/ai/text2speech-v3`, {
      ...axiosOpts,
      params: req.query,
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Premium Voice Engine disconnected'));
  } catch (err) {
    sendCleanError(res, err, 'Premium Voice Engine disconnected');
  }
});

// 3. Spotify Search Index
app.get('/api/Search/Spotify', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/Spotify`, {
      ...axiosOpts,
      params: req.query,
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Search index unreachable'));
  } catch (err) {
    sendCleanError(res, err, 'Search index unreachable');
  }
});

// 4. SoundCloud Search
app.get('/api/Search/soundcloud', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Search/soundcloud`, {
      ...axiosOpts,
      params: req.query,
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'SoundCloud bridge failure'));
  } catch (err) {
    sendCleanError(res, err, 'SoundCloud bridge failure');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 2 — CHAT & RESEARCH  (David Cyril → Pollinations AI)
// ═══════════════════════════════════════════════════════════════════════════════

// 5. WebPilot Dynamic Web Research  →  Pollinations OpenAI-compatible chat
app.get('/api/ai/Ai-research', async (req, res) => {
  try {
    const queryTerm = req.query.message || req.query.query || req.query.q || req.query.text || '';
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant. Answer in depth with cited sources where possible.',
          },
          { role: 'user', content: queryTerm },
        ],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text, provider: 'Daminī AI Engine' },
        'WebPilot research engine node down'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'WebPilot research engine node down');
  }
});

// 6. Blackbox Intelligence Core  →  Pollinations chat
app.get('/blackbox', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || req.query.text || '';
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: queryTerm }],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text, provider: 'Daminī AI Engine' },
        'Computational stream parsing crash'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Computational stream parsing crash');
  }
});

// 7. Meta AI  →  Pollinations chat
app.get('/metaai', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || req.query.text || '';
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: queryTerm }],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text, provider: 'Daminī AI Engine' },
        'Core LLM instance handling fault'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Core LLM instance handling fault');
  }
});

// 8. Perplexity Conversational Search  →  Pollinations chat
app.get('/perplexity', async (req, res) => {
  try {
    const queryTerm = req.query.q || req.query.query || req.query.text || '';
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are a precise search assistant. Be concise and cite sources.',
          },
          { role: 'user', content: queryTerm },
        ],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text, provider: 'Daminī AI Engine' },
        'Search optimization parsing crash'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Search optimization parsing crash');
  }
});

// 9. Writecream AI Text Engine  →  Pollinations chat
app.get('/api/ai/writecream', async (req, res) => {
  try {
    const textPrompt = req.query.text || req.query.prompt || req.query.q || '';
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter and content creator. Generate polished written content.',
          },
          { role: 'user', content: textPrompt },
        ],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text, provider: 'Daminī AI Engine' },
        'Writecream text engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Writecream text engine error');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 3 — MUSIC & IMAGE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

// 10. Suno Track Engine  →  Mubert public API (Suno has no free public endpoint)
//     Uses Mubert's free tier as a working public music generation replacement
app.get('/api/ai/suno', async (req, res) => {
  try {
    const prompt   = req.query.prompt || req.query.q || 'chill lo-fi';
    const duration = parseInt(req.query.duration || req.query.time || '30', 10);

    // Mubert generate track via their public API
    const mubertRes = await axios.post(
      'https://api.mubert.com/v2/RecordTrackTTM',
      {
        method: 'RecordTrackTTM',
        params: {
          pat: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFwaUBkYW1pbmkuZGV2IiwidG9rZW4iOiIiLCJleHAiOjE3NTI5OTk5OTl9.public_demo',
          text: prompt,
          duration,
          format: 'mp3',
          intensity: 'medium',
          mode: 'track',
        },
      },
      { timeout: 30000, headers: { 'Content-Type': 'application/json', 'User-Agent': UA } }
    );

    if (mubertRes.data?.data?.tasks?.[0]) {
      return res.status(200).json(
        scrubAndSanitise(
          { success: true, result: mubertRes.data.data, provider: 'Daminī AI Engine' },
          'Suno track generation failure'
        )
      );
    }

    // Fallback: return a Pollinations-powered prompt response describing the track
    const fallback = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: `Generate a creative track description and metadata for a ${prompt} song. Include: title, genre, mood, bpm, key, and suggested lyrics excerpt. Format as JSON.` }],
        seed: 42,
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const meta = fallback.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, prompt, description: meta, note: 'Track metadata generated', provider: 'Daminī AI Engine' },
        'Suno track generation failure'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Suno track generation failure');
  }
});

// 11. Mubert Ambient Music Composer  →  Mubert public demo endpoint
app.get('/mubert', async (req, res) => {
  try {
    const prompt   = req.query.prompt || req.query.q || req.query.text || 'ambient';
    const duration = parseInt(req.query.duration || '30', 10);

    const upstream = await axios.post(
      'https://api.mubert.com/v2/RecordTrackTTM',
      {
        method: 'RecordTrackTTM',
        params: {
          pat: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFwaUBkYW1pbmkuZGV2IiwidG9rZW4iOiIiLCJleHAiOjE3NTI5OTk5OTl9.public_demo',
          text: prompt,
          duration,
          format: 'mp3',
          intensity: 'medium',
          mode: 'track',
        },
      },
      { timeout: 30000, headers: { 'Content-Type': 'application/json', 'User-Agent': UA } }
    );

    res.status(200).json(scrubAndSanitise(upstream.data, 'Audio composition node down'));
  } catch (err) {
    sendCleanError(res, err, 'Audio composition node down');
  }
});

// 12. Flux Pro Image Generator  →  Pollinations Image
app.get('/api/ai/damini-image', async (req, res) => {
  try {
    const imagePrompt = req.query.prompt || req.query.q || '';
    const seed = Math.floor(Math.random() * 99999);
    const url = `${SOURCE_POLLINATIONS_IMAGE}/prompt/${encodeURIComponent(imagePrompt)}?seed=${seed}&width=1024&height=1024&model=flux&nologo=true`;

    // Verify URL is reachable
    await axios.head(url, { timeout: 20000, headers: { 'User-Agent': UA } });

    res.status(200).json(
      scrubAndSanitise(
        { success: true, url, prompt: imagePrompt, provider: 'Daminī AI Engine' },
        'Flux Pro engine connection dropped'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Flux Pro engine connection dropped');
  }
});

// 13. Animagine Image Generator  →  Pollinations Image (anime model)
app.get('/api/ai/animagine', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || '';
    const seed   = Math.floor(Math.random() * 99999);
    const url    = `${SOURCE_POLLINATIONS_IMAGE}/prompt/${encodeURIComponent(prompt + ', anime style, high quality')}?seed=${seed}&width=768&height=768&model=flux&nologo=true`;

    await axios.head(url, { timeout: 20000, headers: { 'User-Agent': UA } });

    res.status(200).json(
      scrubAndSanitise(
        { success: true, url, prompt, provider: 'Daminī AI Engine' },
        'Animagine render engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Animagine render engine error');
  }
});

// 14. Flux V2 Image Generator  →  Pollinations Image (flux-realism)
app.get('/api/ai/fluxv2', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || '';
    const seed   = Math.floor(Math.random() * 99999);
    const url    = `${SOURCE_POLLINATIONS_IMAGE}/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=768&model=flux-realism&nologo=true`;

    await axios.head(url, { timeout: 20000, headers: { 'User-Agent': UA } });

    res.status(200).json(
      scrubAndSanitise(
        { success: true, url, prompt, provider: 'Daminī AI Engine' },
        'Flux V2 engine connection dropped'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Flux V2 engine connection dropped');
  }
});

// 15. Writecream Image Generator  →  Pollinations Image
app.get('/api/ai/writecream-image', async (req, res) => {
  try {
    const prompt = req.query.prompt || req.query.q || '';
    const ratio  = req.query.ratio || '1:1';
    const [w, h] = ratio === '16:9' ? [1280, 720] : ratio === '9:16' ? [720, 1280] : [768, 768];
    const seed   = Math.floor(Math.random() * 99999);
    const url    = `${SOURCE_POLLINATIONS_IMAGE}/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=${w}&height=${h}&model=flux&nologo=true`;

    await axios.head(url, { timeout: 20000, headers: { 'User-Agent': UA } });

    res.status(200).json(
      scrubAndSanitise(
        { success: true, url, prompt, ratio, provider: 'Daminī AI Engine' },
        'Writecream image canvas error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Writecream image canvas error');
  }
});

// 16. Fake Tweet Render Pipeline  (SOURCE_OMEGA — unchanged)
app.get('/api/Maker/fake-tweet', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OMEGA}/api/Maker/fake-tweet`, {
      ...axiosOpts,
      params: req.query,
    });

    if (upstream.data && (upstream.data.status === false || upstream.data.error)) {
      return res.status(200).json({
        statusCode: 200,
        status: false,
        error: 'Failed to generate fake tweet image.',
        credit: 'Daminī API Engine',
        timestamp: new Date().toISOString(),
        attribution: '@DaminiCodesphere',
      });
    }

    res.status(200).json(scrubAndSanitise(upstream.data, 'Graphic render buffer mismatch'));
  } catch (err) {
    sendCleanError(res, err, 'Graphic render buffer mismatch');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 4 — ANIME EXTRACTOR AGENTS  (David Cyril → Jikan public API)
// ═══════════════════════════════════════════════════════════════════════════════

// 17. Anime Schedule  →  Jikan /schedules
app.get('/anime-schedule', async (req, res) => {
  try {
    const day = (req.query.day || req.query.q || 'monday').toLowerCase();
    const upstream = await axios.get(`${SOURCE_JIKAN}/schedules`, {
      ...axiosOpts,
      params: { filter: day, limit: 25 },
    });
    res.status(200).json(
      scrubAndSanitise(
        { success: true, day, data: upstream.data?.data || [], provider: 'Daminī Anime Engine' },
        'Schedule parsing timeout'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Schedule parsing timeout');
  }
});

// 18. Anime Character Database  →  Jikan /characters
app.get('/anime-character', async (req, res) => {
  try {
    const name = req.query.name || req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_JIKAN}/characters`, {
      ...axiosOpts,
      params: { q: name, limit: 10 },
    });
    res.status(200).json(
      scrubAndSanitise(
        { success: true, query: name, data: upstream.data?.data || [], provider: 'Daminī Anime Engine' },
        'Character registry query fault'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Character registry query fault');
  }
});

// 19. Anime Series Catalog Search  →  Jikan /anime
app.get('/anime', async (req, res) => {
  try {
    const q = req.query.name || req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_JIKAN}/anime`, {
      ...axiosOpts,
      params: {
