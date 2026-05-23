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
