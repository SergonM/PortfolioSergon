/**
 * "The Audit": the hidden CTF behind the auditor's report (section vi).
 *
 * Three flags, each harder than the last:
 *   1. In the page source, which points to ./.well-known/security.txt. That flag is public on purpose.
 *   2. In the envelope: GET this Worker and read the response headers. The flag comes XOR-ed with a
 *      short key and Base64-encoded; the key is the city printed on the cover.
 *   3. In the vault: GET /audit/challenge, sign the nonce and POST it to /audit/vault.
 *      The signature is lowercase hex of HMAC-SHA256(key = flag 2 as UTF-8, message = nonce).
 *      (Yes, the method is only written here. Reading the source is part of the audit.)
 *
 * Flags 2 and 3 are never in this repository: they are derived by HMAC from a Worker secret
 * (AUDIT_SECRET if set, otherwise GEMINI_API_KEY). The browser only ever sends guesses here,
 * and the Worker compares SHA-256 digests in constant time.
 *
 * Whoever holds all three can sign the hall of fame, kept in Workers KV (binding HOF).
 */

export interface AuditEnv {
  AUDIT_SECRET?: string;
  GEMINI_API_KEY?: string;
  HOF?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

export const FLAG_1 = 'SGM{view_source_is_due_diligence}';
const CIPHER_KEY = 'BOGOTA';
const NONCE_TTL = 60; // seconds
const HOF_KEY = 'hall';
const HOF_MAX = 100;

const enc = new TextEncoder();

async function hmacHex(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
  return [...sig].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(s: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

/** Compare two strings by their SHA-256 digests, without stopping at the first difference. */
async function same(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function secret(env: AuditEnv): string {
  return env.AUDIT_SECRET || env.GEMINI_API_KEY || 'local-dev-only';
}

export async function flags(env: AuditEnv): Promise<[string, string, string]> {
  const s = secret(env);
  const f2 = `SGM{headers_dont_lie_${(await hmacHex(s, 'flag-2')).slice(0, 8)}}`;
  const f3 = `SGM{signed_sealed_delivered_${(await hmacHex(s, 'flag-3')).slice(0, 8)}}`;
  return [FLAG_1, f2, f3];
}

/** XOR with a repeating key, then Base64. Basic on purpose: this is flag 2, not flag 3. */
export function xorBase64(plain: string, key: string): string {
  const p = enc.encode(plain);
  const k = enc.encode(key);
  let bin = '';
  for (let i = 0; i < p.length; i++) bin += String.fromCharCode(p[i] ^ k[i % k.length]);
  return btoa(bin);
}

/** The "envelope": headers added to a plain GET of the Worker. */
export async function envelope(env: AuditEnv): Promise<Record<string, string>> {
  const [, f2] = await flags(env);
  return {
    'X-Audit-Paper': '2 of 3. Read the envelope, not the letter.',
    'X-Audit-Cipher': xorBase64(f2, CIPHER_KEY),
    'X-Audit-Method': 'base64 -> xor, repeating key: the city on the cover, in capitals',
    'X-Audit-Next': '3 of 3: GET /audit/challenge, sign it, POST /audit/vault. The method is in this Worker\'s public source.',
    'Access-Control-Expose-Headers': 'X-Audit-Paper, X-Audit-Cipher, X-Audit-Method, X-Audit-Next',
  };
}

async function makeNonce(env: AuditEnv, now = Math.floor(Date.now() / 1000)): Promise<string> {
  return `${now}.${(await hmacHex(secret(env), `nonce:${now}`)).slice(0, 16)}`;
}

async function nonceOk(env: AuditEnv, nonce: string): Promise<boolean> {
  const m = /^(\d{10})\.([0-9a-f]{16})$/.exec(nonce);
  if (!m) return false;
  const ts = Number(m[1]);
  const age = Math.floor(Date.now() / 1000) - ts;
  if (age < 0 || age > NONCE_TTL) return false;
  return same(nonce, await makeNonce(env, ts));
}

/** 0 when the guess is not a flag, otherwise its number. */
async function which(env: AuditEnv, guess: string): Promise<number> {
  const all = await flags(env);
  const g = guess.trim();
  for (let i = 0; i < all.length; i++) if (await same(g, all[i])) return i + 1;
  return 0;
}

type Entry = { name: string; at: string };

async function readHall(env: AuditEnv): Promise<Entry[]> {
  if (!env.HOF) return [];
  try { return JSON.parse((await env.HOF.get(HOF_KEY)) ?? '[]'); } catch { return []; }
}

/** Letters, digits, spaces and . _ - only; at most 24 characters. */
export function cleanName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.normalize('NFC').replace(/[^\p{L}\p{N} ._-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 24);
}

type Json = (body: unknown, status: number) => Response;

/** Routes under /audit/. Returns null for anything else, so the analyst keeps the rest. */
export async function handleAudit(req: Request, env: AuditEnv, path: string, json: Json): Promise<Response | null> {
  if (!path.startsWith('/audit')) return null;

  if (req.method === 'GET' && path === '/audit/challenge') {
    return json({
      nonce: await makeNonce(env),
      expires_in: NONCE_TTL,
      submit: 'POST /audit/vault with JSON {"nonce": "...", "signature": "..."}',
      hint: 'The signature scheme is written in this Worker\'s source code, which is public.',
    }, 200);
  }

  if (req.method === 'GET' && path === '/audit/hall') {
    return json({ hall: (await readHall(env)).slice(0, 50), open: Boolean(env.HOF) }, 200);
  }

  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'body' }, 400); }

  if (path === '/audit/vault') {
    const nonce = typeof body?.nonce === 'string' ? body.nonce : '';
    const signature = typeof body?.signature === 'string' ? body.signature.toLowerCase() : '';
    if (!(await nonceOk(env, nonce))) return json({ error: 'nonce', detail: 'Missing, malformed or older than 60 seconds.' }, 400);
    const [, f2, f3] = await flags(env);
    if (!(await same(signature, await hmacHex(f2, nonce)))) return json({ error: 'signature' }, 403);
    return json({ flag: f3, note: 'Vault open. Submit all three on the auditor\'s report to sign the hall of fame.' }, 200);
  }

  if (path === '/audit/verify') {
    const n = await which(env, String(body?.flag ?? '').slice(0, 80));
    return json({ flag: n }, 200);
  }

  if (path === '/audit/sign') {
    const name = cleanName(body?.name);
    const given: unknown[] = Array.isArray(body?.flags) ? body.flags.slice(0, 3) : [];
    if (!name) return json({ error: 'name' }, 400);
    const found = new Set<number>();
    for (const g of given) found.add(await which(env, String(g ?? '').slice(0, 80)));
    if (!(found.has(1) && found.has(2) && found.has(3))) return json({ error: 'flags' }, 403);
    if (!env.HOF) return json({ error: 'closed' }, 503);
    const hall = await readHall(env);
    let rank = hall.findIndex((e) => e.name.toLowerCase() === name.toLowerCase()) + 1;
    if (!rank) {
      if (hall.length >= HOF_MAX) return json({ error: 'full' }, 409);
      hall.push({ name, at: new Date().toISOString().slice(0, 10) });
      await env.HOF.put(HOF_KEY, JSON.stringify(hall));
      rank = hall.length;
    }
    return json({ rank, hall: hall.slice(0, 50) }, 200);
  }

  return json({ error: 'route' }, 404);
}
