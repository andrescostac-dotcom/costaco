import { getCollection, type CollectionEntry } from 'astro:content';

export type Propiedad = CollectionEntry<'propiedades'>;

const estadoOrden: Record<string, number> = {
  Disponible: 0, 'Pre-Venta': 1, 'En Obra': 2, Reservada: 3, Vendida: 4,
};

export async function getPropiedades() {
  const all = await getCollection('propiedades', (p) => p.data.publicada);
  return all.sort(
    (a, b) =>
      (estadoOrden[a.data.estado] ?? 9) - (estadoOrden[b.data.estado] ?? 9) ||
      a.data.orden - b.data.orden ||
      a.data.titulo.localeCompare(b.data.titulo),
  );
}

export function precioTexto(p: Propiedad['data']) {
  if (!p.precio) return p.estado === 'Vendida' ? 'Vendida' : 'Consultar precio';
  return `${p.moneda} ${p.precio.toLocaleString('es-AR')}`;
}

export function fotos(p: Propiedad['data']) {
  return [...new Set([p.portada, ...p.galeria])];
}

export function estadoClase(estado: string) {
  return 'estado-' + estado.toLowerCase().replace(/[^a-z]/g, '');
}

export function waLink(numero: string, texto: string) {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
}

/** En Netlify, sirve las fotos optimizadas (WebP/AVIF y del tamaño justo) vía su Image CDN. */
const onNetlify = typeof process !== 'undefined' && process.env.NETLIFY === 'true';
export function img(src: string, w: number) {
  if (!onNetlify || !src.startsWith('/')) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&q=78`;
}

/** Link al buscador con filtros (en el #, funciona en cualquier hosting). */
export function buscarHref(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)); });
  const s = q.toString();
  return `/propiedades/${s ? `#${s}` : ''}`;
}

/** URL pública definitiva de una propiedad (la que va en el QR). */
export function urlPropiedad(id: string) {
  // Solo para la versión de prueba en Claude: QR_BASE apunta al link de la vista previa.
  const base = typeof process !== 'undefined' ? process.env.QR_BASE : undefined;
  if (base) return `${base}#${id}`;
  return `https://costaco.life/propiedades/${id}/`;
}

/** Videos: acepta links de YouTube e Instagram y devuelve cómo embeberlos. */
export type Video = { tipo: 'youtube' | 'instagram'; src: string; url: string };
export function parseVideo(url: string): Video | null {
  const u = url.trim();
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/);
  if (yt) return { tipo: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, url: u };
  const ig = u.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/);
  if (ig) return { tipo: 'instagram', src: `https://www.instagram.com/${ig[1] === 'reels' ? 'reel' : ig[1]}/${ig[2]}/embed`, url: u };
  return null;
}

/** Links a Google Maps para una propiedad (por coordenadas o, si no hay, por dirección). */
export function googleMaps(p: Propiedad['data']) {
  const q = p.ubicacion ? `${p.ubicacion.lat},${p.ubicacion.lng}` : [p.direccion, p.barrio, p.localidad, 'Buenos Aires, Argentina'].filter(Boolean).join(', ');
  return {
    ver: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
    llegar: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`,
  };
}

/** Fecha de entrega a mostrar como etiqueta (solo casas en obra o en pre-venta). */
export function entregaTexto(p: Propiedad['data']) {
  return (p.estado === 'En Obra' || p.estado === 'Pre-Venta') && p.entrega ? p.entrega : null;
}
