import type { APIRoute } from 'astro';
import sitio from '../data/sitio.json';
import servicios from '../data/servicios.json';
import faq from '../data/faq.json';
import { getPropiedades } from '../lib';
import { fill } from '../seo';

const SITE = 'https://costaco.life';

export const GET: APIRoute = async () => {
  const props = await getPropiedades();
  const linea = (p: (typeof props)[number]) => {
    const d = p.data;
    const datos = [d.estado, d.ambientes && `${d.ambientes} ambientes`, d.dormitorios && `${d.dormitorios} dormitorios`, (d.sup_total || d.sup_cubierta) && `${d.sup_total || d.sup_cubierta} m²`, d.lote && `lote ${d.lote} m²`, d.entrega && d.estado !== 'Vendida' && `entrega ${d.entrega}`].filter(Boolean).join(', ');
    return `- [${d.titulo}](${SITE}/propiedades/${p.id}/): ${d.tipo} en ${d.operacion.toLowerCase()} en ${d.barrio}${d.localidad && d.localidad !== d.barrio ? ` (${d.localidad})` : ''}. ${datos}.`;
  };
  const activas = props.filter((p) => p.data.estado !== 'Vendida');
  const vendidas = props.filter((p) => p.data.estado === 'Vendida');
  const txt = `# Costa & Co Inmobiliaria

> Inmobiliaria en Zona Norte y CABA (Buenos Aires, Argentina). Compra y venta de propiedades, tasaciones sin costo y asesoramiento inmobiliario, legal, contable e impositivo.

- Sitio: ${SITE}
- Zonas: ${sitio.trabajamos_en}.
- WhatsApp: ${sitio.telefono}
- Email: ${sitio.email}
${sitio.instagram ? `- Instagram: ${sitio.instagram}\n` : ''}
## Servicios

${servicios.items.map((s) => `- [${s.titulo}](${SITE}/servicios/${s.slug}/): ${s.intro}`).join('\n')}

## Propiedades disponibles

${activas.map(linea).join('\n') || '- No hay propiedades disponibles en este momento.'}

## Operaciones concretadas

${vendidas.map(linea).join('\n')}

## Preguntas frecuentes

${faq.items.map((f) => `### ${f.pregunta}\n\n${fill(f.respuesta)}`).join('\n\n')}

## Más información

- [Todas las propiedades](${SITE}/propiedades/)
- [Zonas donde trabajamos](${SITE}/zonas/)
- [Nosotros](${SITE}/nosotros/)
- [Contacto](${SITE}/contacto/)
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
