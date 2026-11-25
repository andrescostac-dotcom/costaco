import type { APIRoute } from 'astro';
import QRCode from 'qrcode';
import { getPropiedades, urlPropiedad } from '../../lib';

export async function getStaticPaths() {
  return (await getPropiedades()).map((p) => ({ params: { id: p.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const svg = await QRCode.toString(urlPropiedad(params.id!), {
    type: 'svg', margin: 2, errorCorrectionLevel: 'M', color: { dark: '#0B0C0B', light: '#FFFFFF' },
  });
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
