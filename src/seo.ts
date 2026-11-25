// Datos estructurados (schema.org) para SEO y buscadores con IA.
import sitio from './data/sitio.json';
import zonas from './data/zonas.json';
import type { Propiedad } from './lib';

export const SITE = 'https://costaco.life';
const abs = (p: string) => new URL(p, SITE).toString();

export const fill = (t: string) => t.replace('{telefono}', sitio.telefono).replace('{email}', sitio.email);

export function agencia() {
  const s = sitio as Record<string, string>;
  return {
    '@type': 'RealEstateAgent',
    '@id': `${SITE}/#inmobiliaria`,
    name: 'Costa & Co Inmobiliaria',
    alternateName: 'Costa & Co',
    url: SITE,
    logo: abs('/og.jpg'),
    image: abs('/og.jpg'),
    description: 'Inmobiliaria en Zona Norte y CABA. Compra, venta, tasaciones y asesoramiento inmobiliario, legal, contable e impositivo.',
    email: sitio.email,
    telephone: sitio.telefono.replace(/[^\d+]/g, ''),
    areaServed: zonas.partidos.map((z) => ({ '@type': 'Place', name: z.nombre === 'Interior de Buenos Aires' ? 'San Antonio de Areco' : z.nombre })),
    knowsAbout: ['Compra de propiedades', 'Venta de propiedades', 'Tasaciones inmobiliarias', 'Asesoramiento inmobiliario', 'Casas a estrenar'],
    ...(s.oficina ? { address: { '@type': 'PostalAddress', streetAddress: s.oficina, addressCountry: 'AR' } } : { address: { '@type': 'PostalAddress', addressRegion: 'Buenos Aires', addressCountry: 'AR' } }),
    ...(sitio.instagram ? { sameAs: [sitio.instagram] } : {}),
    parentOrganization: { '@type': 'Organization', name: 'CosCor Real Estate', url: 'https://coscor.life' },
  };
}

export function website() {
  return { '@type': 'WebSite', '@id': `${SITE}/#web`, url: SITE, name: 'Costa & Co', inLanguage: 'es-AR', publisher: { '@id': `${SITE}/#inmobiliaria` } };
}

export function breadcrumbs(items: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Inicio', '/'], ...items].map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })),
  };
}

export function faqPage(items: { pregunta: string; respuesta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.pregunta, acceptedAnswer: { '@type': 'Answer', text: fill(f.respuesta) } })),
  };
}

const disponibilidad: Record<string, string> = {
  Disponible: 'https://schema.org/InStock',
  'Pre-Venta': 'https://schema.org/PreOrder',
  'En Obra': 'https://schema.org/PreOrder',
  Reservada: 'https://schema.org/LimitedAvailability',
  Vendida: 'https://schema.org/SoldOut',
};

export function inmueble(p: Propiedad, fotos: string[]) {
  const d = p.data;
  const url = `${SITE}/propiedades/${p.id}/`;
  const m2 = d.sup_total || d.sup_cubierta;
  const lugar = {
    '@type': d.tipo === 'Departamento' ? 'Apartment' : 'SingleFamilyResidence',
    name: d.titulo,
    address: { '@type': 'PostalAddress', streetAddress: d.direccion ?? undefined, addressLocality: d.barrio, addressRegion: d.localidad ?? 'Buenos Aires', addressCountry: 'AR' },
    ...(d.ambientes ? { numberOfRooms: d.ambientes } : {}),
    ...(d.dormitorios ? { numberOfBedrooms: d.dormitorios } : {}),
    ...(d.banos ? { numberOfBathroomsTotal: d.banos } : {}),
    ...(m2 ? { floorSize: { '@type': 'QuantitativeValue', value: m2, unitCode: 'MTK' } } : {}),
    amenityFeature: d.caracteristicas.map((c) => ({ '@type': 'LocationFeatureSpecification', name: c, value: true })),
  };
  return {
    '@type': 'RealEstateListing',
    '@id': `${url}#aviso`,
    url,
    name: d.titulo,
    description: d.resumen || `${d.tipo} en ${d.barrio}`,
    image: fotos.slice(0, 8).map(abs),
    inLanguage: 'es-AR',
    about: lugar,
    provider: { '@id': `${SITE}/#inmobiliaria` },
    offers: {
      '@type': 'Offer',
      businessFunction: d.operacion === 'Venta' ? 'https://purl.org/goodrelations/v1#Sell' : 'https://purl.org/goodrelations/v1#LeaseOut',
      availability: disponibilidad[d.estado] ?? 'https://schema.org/InStock',
      ...(d.precio ? { price: d.precio, priceCurrency: d.moneda } : {}),
      seller: { '@id': `${SITE}/#inmobiliaria` },
    },
  };
}
