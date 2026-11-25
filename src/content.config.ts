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
    desarrolla_coscor: z.boolean().default(false),
    orden: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.number().default(100)),
    portada: z.string(),
    galeria: z.array(z.string()).nullish().transform((v) => v ?? []),
    planos: z.array(z.string()).nullish().transform((v) => v ?? []),
    terminaciones: z.array(z.string()).nullish().transform((v) => v ?? []),
    video: z.string().nullish(),
  }),
});

export const collections = { propiedades };
