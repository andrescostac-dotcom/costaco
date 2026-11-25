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
  if (p.estado === 'Vendida') return 'Vendida';
  if (!p.precio) return 'Consultar precio';
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
