import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Legitimate SEO and social media bots (ALLOWED)
const ALLOWED_BOTS = [
  'googlebot', 'google-inspectiontool', 'googlebot-image', 'googlebot-mobile',
  'bingbot', 'bingpreview', 'msnbot',
  'slurp', 'yahoo', // Yahoo
  'duckduckbot', 'duckduckgo', // DuckDuckGo
  'yandexbot', 'yandex', // Yandex
  'baiduspider', 'baidu', // Baidu
  'twitterbot', 'facebookexternalhit', 'facebookcatalog', 'linkedinbot',
  'slackbot', 'telegrambot', 'whatsapp', 'discordbot',
  'applebot', 'apple-pubsub', // Apple
];

// Malicious/bandwidth-wasting bots (BLOCKED)
const BLOCKED_BOTS = [
  // Scanners & vulnerability testers
  'scanner', 'scan', 'nikto', 'nmap', 'masscan', 'zmap', 'shodan',
  'censys', 'zgrab', 'nuclei', 'acunetix', 'nessus', 'openvas',
  
  // Scrapers
  'scraper', 'scrape', 'scrapy', 'beautifulsoup', 'mechanize',
  'selenium', 'webdriver', 'puppeteer', 'playwright', 'headless',
  'phantom', 'splash',
  
  // Generic HTTP clients (often used for scraping)
  'curl', 'wget', 'python-requests', 'python-urllib', 'java/',
  'go-http', 'ruby', 'perl', 'libwww', 'lwp', 'httpclient',
  'okhttp', 'apache-httpclient', 'axios', 'node-fetch',
  
  // AI scrapers (non-search)
  'gptbot', 'chatgpt', 'claude-web', 'anthropic',
  
  // Known bad actors
  'semrush', 'ahrefs', 'mj12bot', 'dotbot', 'rogerbot',
  'blexbot', 'dataforseo', 'serpstat', 'petalbot',
];

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number; violations: number }>();

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  maxViolations: 3, // Ban after 3 violations
  banDurationMs: 3600 * 1000, // 1 hour ban
};

function isAllowedBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return ALLOWED_BOTS.some(bot => ua.includes(bot));
}

function isBlockedBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BLOCKED_BOTS.some(bot => ua.includes(bot));
}

function checkRateLimit(ip: string): { allowed: boolean; isBanned: boolean } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Check if banned
  if (record && record.violations >= RATE_LIMIT.maxViolations) {
    const banExpiry = record.resetTime + RATE_LIMIT.banDurationMs;
    if (now < banExpiry) {
      return { allowed: false, isBanned: true };
    } else {
      // Ban expired, reset
      rateLimitStore.delete(ip);
    }
  }

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
      violations: record?.violations || 0,
    });
    return { allowed: true, isBanned: false };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    // Rate limit exceeded
    record.violations++;
    return { allowed: false, isBanned: false };
  }

  record.count++;
  return { allowed: true, isBanned: false };
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';

  // Allow legitimate SEO bots (bypass rate limiting)
  if (isAllowedBot(userAgent)) {
    return NextResponse.next();
  }

  // Block known bad bots immediately
  if (isBlockedBot(userAgent)) {
    console.log(`[BLOCKED BOT] ${userAgent.substring(0, 50)} from ${ip}`);
    return new NextResponse('Forbidden - Automated Access Detected', { 
      status: 403,
      headers: {
        'X-Blocked-Reason': 'Unauthorized Bot',
      },
    });
  }

  // Block empty or suspicious user agents
  if (!userAgent || userAgent.length < 10) {
    console.log(`[BLOCKED] Suspicious/empty user agent from ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Rate limiting for everyone else
  const { allowed, isBanned } = checkRateLimit(ip);

  if (isBanned) {
    console.log(`[BANNED] ${ip} - Too many violations`);
    return new NextResponse('Banned - Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '3600',
        'X-Ban-Reason': 'Excessive rate limit violations',
      },
    });
  }

  if (!allowed) {
    console.log(`[RATE LIMITED] ${ip} exceeded ${RATE_LIMIT.maxRequests} requests/minute`);
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  // Block direct API access without proper origin (prevents API scraping)
  const url = request.nextUrl;
  if (url.pathname.startsWith('/api/')) {
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    
    // Allow from same domain or localhost
    const isValidOrigin = 
      referer?.includes(url.hostname) ||
      origin?.includes(url.hostname) ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1';

    if (!isValidOrigin && !isAllowedBot(userAgent)) {
      console.log(`[BLOCKED API] Direct API access from ${ip} to ${url.pathname}`);
      return new NextResponse('Forbidden - Direct API Access Not Allowed', { 
        status: 403,
        headers: {
          'X-Blocked-Reason': 'Invalid Origin',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
