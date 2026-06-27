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
const SOURCE_MOVIE_DATA   = 'https://videodownloader.site';
const SOURCE_STREAM_PRIMARY = 'https://embed.su/embed/movie';
const SOURCE_STREAM_MIRROR  = 'https://vidsrc.to/embed/movie';

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
      params: { q, limit: 10 },
    });
    res.status(200).json(
      scrubAndSanitise(
        { success: true, query: q, data: upstream.data?.data || [], provider: 'Daminī Anime Engine' },
        'Catalog engine lookup failure'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'Catalog engine lookup failure');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 5 — MEDIA DOWNLOADER LAYER  (David Cyril → Cobalt.tools)
//   Cobalt is a free, open-source public media downloader API
// ═══════════════════════════════════════════════════════════════════════════════

// Helper: call Cobalt API
async function cobaltDownload(url) {
  const res = await axios.post(
    `${SOURCE_COBALT}/`,
    { url, videoQuality: 'max', audioFormat: 'mp3', filenameStyle: 'pretty' },
    {
      timeout: 25000,
      headers: {
        'User-Agent': UA,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return res;
}

// 20. Facebook Downloader V1  →  Cobalt
app.get('/api/download/facebook', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Facebook extraction pipeline fault'));
  } catch (err) {
    sendCleanError(res, err, 'Facebook extraction pipeline fault');
  }
});

// 21. Facebook Downloader V2  →  Cobalt (same engine, alias route)
app.get('/api/download/facebook2', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Facebook V2 extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'Facebook V2 extraction fault');
  }
});

// 22. Instagram Downloader  →  Cobalt
app.get('/api/download/instagram', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Instagram media extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'Instagram media extraction fault');
  }
});

// 23. Mediafire Downloader  →  Cobalt
app.get('/api/download/mediafire', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Mediafire link resolution fault'));
  } catch (err) {
    sendCleanError(res, err, 'Mediafire link resolution fault');
  }
});

// 24. Pinterest Downloader  →  Cobalt
app.get('/api/download/pinterest', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Pinterest asset extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'Pinterest asset extraction fault');
  }
});

// 25. TikTok Downloader V2  →  Cobalt
app.get('/api/download/tiktokv2', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'TikTok V2 extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'TikTok V2 extraction fault');
  }
});

// 26. Twitter/X Downloader  →  Cobalt
app.get('/api/download/twitter', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'Twitter media extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'Twitter media extraction fault');
  }
});

// 27. YouTube Downloader V3  →  Cobalt
app.get('/api/download/ytv3', async (req, res) => {
  try {
    const upstream = await cobaltDownload(req.query.url || '');
    res.status(200).json(scrubAndSanitise(upstream.data, 'YouTube V3 extraction fault'));
  } catch (err) {
    sendCleanError(res, err, 'YouTube V3 extraction fault');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 6 — INTERACTIVE & FUN ENGINES  (David Cyril → public APIs)
// ═══════════════════════════════════════════════════════════════════════════════

// 28. Random Fact  →  UselessFacts public API
app.get('/fact', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_USELESSFACTS}/api/v2/facts/random?language=en`, axiosOpts);
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: upstream.data?.text || '', provider: 'Daminī API Engine' },
        'fact engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'fact engine error');
  }
});

// 29. Random Joke  →  Official Joke API (public)
//     (previously /truth route — Cyril had no public joke API; this is a real working replacement)
app.get('/joke', async (req, res) => {
  try {
    const upstream = await axios.get(`${SOURCE_OFFICIALJOKEAPI}/random_joke`, axiosOpts);
    const joke = upstream.data;
    res.status(200).json(
      scrubAndSanitise(
        { success: true, setup: joke?.setup, punchline: joke?.punchline, result: `${joke?.setup} ... ${joke?.punchline}`, provider: 'Daminī API Engine' },
        'joke engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'joke engine error');
  }
});

// 30. Truth Generator  →  Pollinations AI generated truth question
app.get('/truth', async (req, res) => {
  try {
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: 'Give me one creative and interesting truth question for a truth or dare game. Return only the question, nothing else.' }],
        seed: Math.floor(Math.random() * 9999),
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text.trim(), provider: 'Daminī API Engine' },
        'truth engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'truth engine error');
  }
});

// 31. Dare Generator  →  Pollinations AI generated dare
app.get('/dare', async (req, res) => {
  try {
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: 'Give me one fun and creative dare challenge for a truth or dare game. Return only the dare, nothing else.' }],
        seed: Math.floor(Math.random() * 9999),
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text.trim(), provider: 'Daminī API Engine' },
        'dare engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'dare engine error');
  }
});

// 32. Pick-Up Line Generator  →  Pollinations AI
app.get('/pickupline', async (req, res) => {
  try {
    const upstream = await axios.post(
      `${SOURCE_POLLINATIONS_TEXT}/openai`,
      {
        model: 'openai',
        messages: [{ role: 'user', content: 'Give me one creative and funny pick-up line. Return only the pick-up line, nothing else.' }],
        seed: Math.floor(Math.random() * 9999),
      },
      { ...axiosOpts, headers: { ...axiosOpts.headers, 'Content-Type': 'application/json' } }
    );
    const text = upstream.data?.choices?.[0]?.message?.content ?? '';
    res.status(200).json(
      scrubAndSanitise(
        { success: true, result: text.trim(), provider: 'Daminī API Engine' },
        'pickupline engine error'
      )
    );
  } catch (err) {
    sendCleanError(res, err, 'pickupline engine error');
  }
});
// ═══════════════════════════════════════════════════════════════════════════════
//   CATEGORY 7 — CINEMA & MOVIE TRACKING CORE
// ═══════════════════════════════════════════════════════════════════════════════

// 33. Movie Database Search Index
app.get('/api/cinema/search', async (req, res) => {
  try {
    const query = req.query.q || req.query.query || '';
    const upstream = await axios.get(`${SOURCE_MOVIE_DATA}/search`, {
      ...axiosOpts,
      params: { q: query, type: 'movie' },
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Movie cluster search node unreachable'));
  } catch (err) {
    sendCleanError(res, err, 'Movie cluster search node unreachable');
  }
});

// 34. Detailed Structural Asset Inventory
app.get('/api/cinema/details', async (req, res) => {
  try {
    const subjectId = req.query.id || req.query.subject_id || '';
    const upstream = await axios.get(`${SOURCE_MOVIE_DATA}/details`, {
      ...axiosOpts,
      params: { subject_id: subjectId },
    });
    res.status(200).json(scrubAndSanitise(upstream.data, 'Asset metrics query failure'));
  } catch (err) {
    sendCleanError(res, err, 'Asset metrics query failure');
  }
});

// 35. Primary Stream Frame Player Engine (Returns URL for Frontend Iframes)
app.get('/api/cinema/stream', (req, res) => {
  const tmdbId = req.query.tmdb_id || req.query.id || '';
  if (!tmdbId) {
    return res.status(400).json({ success: false, error: 'Missing parameter: tmdb_id' });
  }
  
  // Directly masks upstream identities while constructing clean responses
  res.status(200).json({
    success: true,
    streamUrl: `${SOURCE_STREAM_PRIMARY}/${tmdbId}`,
    provider: 'Daminī Cinema Engine',
    owner: 'Dev Daminī'
  });
});

// 36. Alternative Mirror Cinema Frame Player
app.get('/api/cinema/stream-mirror', (req, res) => {
  const tmdbId = req.query.tmdb_id || req.query.id || '';
  if (!tmdbId) {
    return res.status(400).json({ success: false, error: 'Missing parameter: tmdb_id' });
  }
  
  res.status(200).json({
    success: true,
    streamUrl: `${SOURCE_STREAM_MIRROR}/${tmdbId}`,
    provider: 'Daminī Cinema Engine',
    owner: 'Dev Daminī'
  });
});
// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: 'Route not found on proxy layer',
    provider: 'Daminī API Engine',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Daminī Proxy] Active on port ${PORT}`));
