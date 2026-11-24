import { indexable, absolute } from '../site';
export const GET = () => new Response(indexable ? 'User-agent: *\nAllow: /\nSitemap: '+absolute('/sitemap.xml')+'\n' : 'User-agent: *\nDisallow: /\n', { headers:{'Content-Type':'text/plain; charset=utf-8'} });
