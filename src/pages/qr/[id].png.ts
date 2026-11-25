import type { APIRoute } from 'astro';
import QRCode from 'qrcode';
import { getPropiedades, urlPropiedad } from '../../lib';

export async function getStaticPaths() {
  return (await getPropiedades()).map((p) => ({ params: { id: p.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const png = await QRCode.toBuffer(urlPropiedad(params.id!), {
    type: 'png', width: 1200, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#0B0C0B', light: '#FFFFFF' },
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
