import type { APIRoute } from 'astro';
import servicios from '../data/servicios.json';
import { getPropiedades } from '../lib';

const SITE = 'https://costaco.life';

export const GET: APIRoute = async () => {
  const props = await getPropiedades();
  const urls: { loc: string; priority: string; changefreq: string; images?: string[] }[] = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/propiedades/', priority: '0.9', changefreq: 'daily' },
    ...props.map((p) => ({
      loc: `/propiedades/${p.id}/`,
      priority: p.data.estado === 'Vendida' ? '0.4' : '0.8',
      changefreq: 'weekly',
      images: [p.data.portada, ...p.data.galeria].slice(0, 10),
    })),
    { loc: '/servicios/', priority: '0.7', changefreq: 'monthly' },
    ...servicios.items.map((s) => ({ loc: `/servicios/${s.slug}/`, priority: '0.7', changefreq: 'monthly' })),
    { loc: '/nosotros/', priority: '0.5', changefreq: 'monthly' },
    { loc: '/contacto/', priority: '0.5', changefreq: 'yearly' },
  ];
  const esc = (s: string) => s.replace(/&/g, '&amp;');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${(u.images ?? []).map((i) => `\n    <image:image><image:loc>${esc(SITE + i)}</image:loc></image:image>`).join('')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
