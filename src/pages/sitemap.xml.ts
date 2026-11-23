import { sitemap } from '../site';
export const GET = () => new Response(sitemap(),{headers:{'Content-Type':'application/xml; charset=utf-8'}});
