import { auth } from '../firebase';

const DEFAULT_BASE_URL = 'http://localhost:5000';

function resolveBaseUrl(): string {
  const env = (import.meta as any)?.env;
  if (env?.VITE_API_URL) return String(env.VITE_API_URL);
  return DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;
  body?: unknown;
  constructor(args: {
    message: string;
    status: number;
    code: string;
    requestId?: string;
    body?: unknown;
  }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.code = args.code;
    this.requestId = args.requestId;
    this.body = args.body;
  }
}

type RequestInit_ = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  retries?: number;
  auth?: 'auto' | 'omit';
};

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function getIdToken(): Promise<string | null> {
  const currentUser = auth?.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken(false);
  } catch {
    return null;
  }
}

function buildUrl(path: string, query?: RequestInit_['query']): string {
  const base = resolveBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let url = `${base}${cleanPath}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      params.set(k, String(v));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

async function request<T = unknown>(opts: RequestInit_): Promise<T> {
  const method = opts.method ?? 'GET';
  const retries = opts.retries ?? 1;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(opts.headers || {}),
    };
    let body: BodyInit | undefined;
    if (opts.body !== undefined && opts.body !== null) {
      if (opts.body instanceof FormData) {
        body = opts.body;
      } else {
        headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
        body = JSON.stringify(opts.body);
      }
    }

    if (opts.auth !== 'omit') {
      const token = await getIdToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(buildUrl(opts.path, opts.query), {
        method,
        headers,
        body,
        signal: opts.signal,
      });
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(200 * Math.pow(2, attempt));
        continue;
      }
      throw new ApiError({
        message: (err as Error)?.message || 'Network error',
        status: 0,
        code: 'network_error',
      });
    }

    const requestId =
      response.headers.get('x-request-id') ||
      response.headers.get('x-correlation-id') ||
      undefined;

    let parsed: unknown = undefined;
    const text = await response.text().catch(() => '');
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (response.ok) {
      return parsed as T;
    }

    const code =
      (parsed && typeof parsed === 'object' && 'code' in parsed && String((parsed as any).code)) ||
      `http_${response.status}`;

    const err = new ApiError({
      message:
        (parsed && typeof parsed === 'object' && 'message' in parsed && String((parsed as any).message)) ||
        response.statusText ||
        `HTTP ${response.status}`,
      status: response.status,
      code,
      requestId,
      body: parsed,
    });
    lastErr = err;

    if (RETRYABLE_STATUS.has(response.status) && attempt < retries) {
      await sleep(200 * Math.pow(2, attempt));
      continue;
    }
    throw err;
  }

  throw lastErr;
}

export const apiClient = {
  baseUrl: resolveBaseUrl,
  get:    <T = unknown>(path: string, opts: Omit<RequestInit_, 'method' | 'path'> = {}) => request<T>({ ...opts, method: 'GET',    path }),
  post:   <T = unknown>(path: string, body?: unknown, opts: Omit<RequestInit_, 'method' | 'path' | 'body'> = {}) => request<T>({ ...opts, method: 'POST',   path, body }),
  put:    <T = unknown>(path: string, body?: unknown, opts: Omit<RequestInit_, 'method' | 'path' | 'body'> = {}) => request<T>({ ...opts, method: 'PUT',    path, body }),
  patch:  <T = unknown>(path: string, body?: unknown, opts: Omit<RequestInit_, 'method' | 'path' | 'body'> = {}) => request<T>({ ...opts, method: 'PATCH',  path, body }),
  del:    <T = unknown>(path: string, opts: Omit<RequestInit_, 'method' | 'path'> = {}) => request<T>({ ...opts, method: 'DELETE', path }),
};

export default apiClient;
