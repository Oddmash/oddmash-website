import { staticPages } from './content';
const raw = process.env.ODDMASH_SITE_ORIGIN ?? '';
const launch = process.env.ODDMASH_PUBLIC_LAUNCH === 'true';
const validOrigin = (value:string) => {
  try { const u = new URL(value); return u.protocol === 'https:' && u.pathname === '/' && !u.username && !u.password && !u.search && !u.hash ? u.origin : ''; } catch { return ''; }
};
export const origin = launch ? validOrigin(raw) : '';
export const indexable = Boolean(origin);
export const absolute = (path:string) => origin ? new URL(path, origin).href : undefined;
export const sitemap = () => indexable ? '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + staticPages.map(p=>'<url><loc>'+absolute(p.href)+'</loc></url>').join('')+'</urlset>' : '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>';
