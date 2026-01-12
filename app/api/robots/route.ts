import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# Robots.txt - Block most crawlers to save bandwidth
# Only allow major search engines

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Block all other bots
User-agent: *
Disallow: /

# Block API routes from all crawlers
User-agent: *
Disallow: /api/

# Block admin/auth routes
User-agent: *
Disallow: /auth/
Disallow: /admin/

# Crawl delay for allowed bots (reduce server load)
Crawl-delay: 10`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
