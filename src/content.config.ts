import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const num = z.preprocess((v) => (v === '' ? null : v), z.coerce.number().nullish());

const propiedades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/propiedades' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string().default(''),
    estado: z.enum(['Disponible', 'Pre-Venta', 'En Obra', 'Reservada', 'Vendida']).default('Disponible'),
    operacion: z.enum(['Venta', 'Alquiler', 'Alquiler temporario']).default('Venta'),
    tipo: z.string().default('Casa'),
    direccion: z.string().nullish(),
    barrio: z.string(),
    localidad: z.string().nullish(),
    // Ubicación en el mapa. El panel la guarda como GeoJSON: {"type":"Point","coordinates":[lng,lat]}
    ubicacion: z
      .union([z.string(), z.object({ type: z.string(), coordinates: z.array(z.number()) })])
      .nullish()
      .transform((v) => {
        if (!v) return null;
        try {
          const g = typeof v === 'string' ? JSON.parse(v) : v;
          const [lng, lat] = g.coordinates;
          return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
        } catch {
          return null;
        }
      }),
    precio: num,
    moneda: z.enum(['USD', 'ARS']).default('USD'),
    ambientes: num,
    dormitorios: num,
    banos: num,
    cocheras: num,
    sup_total: num,
    sup_cubierta: num,
    lote: num,
    jardin: num,
    entrega: z.string().nullish(),
    destacada: z.boolean().default(false),
    publicada: z.boolean().default(true),
    orden: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.number().default(100)),
    portada: z.string().nullish(),
    galeria: z.array(z.string()).nullish().transform((v) => [...new Set(v ?? [])]),
    // Respaldo: si quedaron "fotos nuevas" sin pasar a la galería, se suman al final.
    fotos_nuevas: z.array(z.string()).nullish().transform((v) => v ?? []),
    planos: z.array(z.string()).nullish().transform((v) => v ?? []),
    caracteristicas: z.array(z.string()).nullish().transform((v) => v ?? []),
    terminaciones: z.array(z.string()).nullish().transform((v) => v ?? []),
    video: z.string().nullish(),
    seo_titulo: z.string().nullish(),
    seo_descripcion: z.string().nullish(),
    videos: z.array(z.string()).nullish().transform((v) => v ?? []),
  }).transform((d) => {
    const galeria = [...new Set([...d.galeria, ...d.fotos_nuevas])];
    return { ...d, galeria, portada: d.portada || galeria[0] || '/og.jpg' };
  }),
});

export const collections = { propiedades };
