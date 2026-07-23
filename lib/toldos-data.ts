export interface Toldo {
  id: string
  nombre: string
  subtitulo: string | null
  descripcion: string
  medidas: string
  caracteristicas: string[]
}

export const toldos: Toldo[] = [
  {
    id: 'toldo-transparente-arabe',
    nombre: 'Toldo Transparente Árabe',
    subtitulo: 'Elegancia y Vista Panorámica',
    descripcion:
      'Perfecto para eventos nocturnos donde la iluminación y las estrellas crean una atmósfera mágica. Su diseño transparente permite disfrutar completamente de la vista del entorno mientras protege a tus invitados.',
    medidas: 'Desde 3x3 mts hasta 12x30 mts',
    caracteristicas: [
      'Estructura de aluminio reforzada de alta resistencia',
      'Cubierta de material Sky Light Cristal importado',
      'Transmisión óptima de luz natural',
      'Resistente a condiciones climáticas adversas',
    ],
  },
  {
    id: 'toldo-luminoso',
    nombre: 'Toldo Luminoso',
    subtitulo: null,
    descripcion:
      'Ideal para celebraciones nocturnas bajo las estrellas, con iluminación natural gracias a su material translúcido.',
    medidas: 'Desde 3x3 mts hasta 12x30 mts',
    caracteristicas: [
      'Iluminación natural: material Sky Light Cristal que maximiza la entrada de luz',
      'Eventos nocturnos: ideal para celebraciones bajo las estrellas',
      'Estructura reforzada: aluminio de alta calidad importado',
    ],
  },
  {
    id: 'toldo-trenzado',
    nombre: 'Toldo Trenzado',
    subtitulo: 'Diseño Natural y Refrescante',
    descripcion:
      'Un modelo único que combina funcionalidad con estética natural. Perfecto para ambientes cálidos donde se busca ventilación y sombra sin perder el contacto con el ambiente exterior.',
    medidas: '3x3 mts hasta 12x30 mts',
    caracteristicas: [
      'Estructura de aluminio reforzada',
      'Cuadros cubiertos con tiras de yute trenzadas',
      'Ventilación natural superior',
      'Peso ligero para fácil instalación',
    ],
  },
  {
    id: 'toldo-arabe-blanco',
    nombre: 'Toldo Árabe Blanco',
    subtitulo: null,
    descripcion:
      'Estilo clásico que se adapta a cualquier tipo de evento, con protección térmica y certificación internacional de calidad.',
    medidas:
      'Desde 3x3 mts hasta 12x30 mts. Estructura de aluminio reforzada para máxima durabilidad y resistencia.',
    caracteristicas: [
      'Diseño tradicional: estilo clásico que se adapta a cualquier tipo de evento',
      'Protección térmica: mantiene una temperatura agradable en el interior',
      'Certificación ISO 9001: argolite importado con garantía de calidad internacional',
    ],
  },
  {
    id: 'toldo-malla-sombra',
    nombre: 'Toldo Malla Sombra',
    subtitulo: 'Protección Multifuncional',
    descripcion:
      'La solución ideal para quien busca frescura, resistencia y ligereza en un solo producto. Perfecto para espacios que requieren ventilación constante.',
    medidas: 'Desde 3x6 mts hasta 6x12 mts',
    caracteristicas: [
      'Protección efectiva contra rayos solares',
      'Material transpirable y duradero',
      'Instalación rápida y sencilla',
      'Bajo mantenimiento',
    ],
  },
  {
    id: 'toldo-eurotent-blanco',
    nombre: 'Toldo Eurotent Blanco',
    subtitulo: 'Toldos Alemanes de Alta Gama',
    descripcion:
      'Toldo alemán premium con diseño elegante y sofisticado, funcionalidad superior y protección contra la intemperie.',
    medidas: 'Boca de 20 mts, expandible de 5 mts hasta alcanzar 20x50 mts',
    caracteristicas: [
      'Diseño elegante y sofisticado',
      'Funcionalidad superior',
      'Lonas resistentes a rayos UV',
      'Protección contra intemperie',
      'Estructura de aluminio reforzada de ingeniería alemana',
    ],
  },
  {
    id: 'toldo-eurotent-transparente',
    nombre: 'Toldo Eurotent Transparente',
    subtitulo: 'Toldos Alemanes de Alta Gama',
    descripcion:
      'Misma calidad alemana premium que el modelo blanco, con vista panorámica completa, ideal para eventos de gran escala.',
    medidas: 'Boca de 20 mts, expandible de 5 mts hasta alcanzar 20x50 mts',
    caracteristicas: [
      'Misma calidad alemana premium',
      'Vista panorámica completa',
      'Resistencia UV garantizada',
      'Ideal para eventos de gran escala',
      'Estructura de aluminio reforzada de ingeniería alemana',
    ],
  },
  {
    id: 'toldo-festival',
    nombre: 'Toldo Festival',
    subtitulo: 'Diseño Distintivo',
    descripcion:
      'Un toldo con forma única y distintiva que transforma completamente la estética de tu evento, diferenciándose de los toldos tradicionales rectangulares. Su diseño arquitectónico aporta un toque de sofisticación y modernidad, convirtiéndose en el punto focal de cualquier celebración.',
    medidas: '3x3 mts y 12x18 mts',
    caracteristicas: [
      'Forma única y distintiva',
      'Estructura de aluminio reforzada',
      'Instalación versátil',
      'Máxima estabilidad en diversas condiciones climáticas',
    ],
  },
  {
    id: 'euro-bow',
    nombre: 'Euro Bow',
    subtitulo: 'Toldos Profesionales de Gran Formato',
    descripcion:
      'Estructura arqueada innovadora que optimiza sombra y estabilidad, con estética moderna y funcional.',
    medidas: '10x18 mts',
    caracteristicas: [
      'Estructura arqueada innovadora',
      'Optimización de sombra y estabilidad',
      'Lonas acrílicas de alta calidad',
      'Estética moderna y funcional',
    ],
  },
  {
    id: 'jumbo-track',
    nombre: 'Jumbo Track',
    subtitulo: 'Toldos Profesionales de Gran Formato',
    descripcion:
      'Toldo de gran formato ideal para eventos masivos, con sistema de tensión constante que mantiene la lona firme en cualquier posición.',
    medidas: '15x30 mts',
    caracteristicas: [
      'Estructura de aluminio reforzada',
      'Sistema de tensión constante',
      'Lona firme en cualquier posición',
      'Ideal para eventos masivos',
    ],
  },
  {
    id: 'cabana',
    nombre: 'Cabana',
    subtitulo: 'Toldos Profesionales de Gran Formato',
    descripcion: 'Diseño a dos aguas perfecto para espacios compactos, con drenaje eficiente de agua.',
    medidas: '3x3 mts',
    caracteristicas: [
      'Diseño a dos aguas',
      'Drenaje eficiente de agua',
      'Estructura de aluminio reforzada',
      'Perfecto para espacios compactos',
    ],
  },
]
