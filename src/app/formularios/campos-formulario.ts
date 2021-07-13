import {Validators} from '@angular/forms';

export interface CamposFormulario {
  detalles: {
  projectid?: string,
  email?: string,
  tipo_enfoque?: string,
  nombre?: string,
  telefono_contacto?: number,
  institucion?: string,
  titulo_extendido?: string,
  descripcion?: string,
  resumen?: string,
  tipo_estudio?: string,
  redes_sociales?: redesSociales,
  pais?: string,
  palabras_clave?: string,
  provincia?: string,
  tipo_produccion?: string,
  localidad_cercana?: string,
  estado_actual?: string,
  coordenadas?: string,
  ano_inicio?: string,
  web?: string,
  nombre_sitio?: string,
  tipo_sitio?: string,
  resultados?: string,
  linksfotos?: [{ link?: string, descripcion?: string }]
  personal?: personal[],
  especies?: especies[],
  alcance_geografico?: string,
}
}

export interface redesSociales {
  facebook?: string,
  instagram?: string,
  twitter?: string,
  youtube?: string,
  researchgate?: string,
  otra?: string
}

export interface personal {
  nombre_apellido?: string,
  rol?: string,
  genero?: string,
  profesion?: string,
  especialidad?: string,
  fecha_nacimiento?: string,
  pais_residencia?: string,
  provincia_residencia?: string,
  email_personal?: string, // , Validators.email
  redes_sociales_personal?: redesSociales
}

export interface especies {
  spob?:string,
  nombre_vulgar?: string,
  nombre_ingles?: string,
  tso?:string
}

export const areasTemBiodiversidad = [
   'Fauna',
   'Hongos',
   'Microorganismos',
   'Vegetación',
   'Especies nativas',
   'Especies endémicas',
   'Especies exóticas invasoras',
   'Especies en cautiverio',
   'Especies en silvestría',
   'Especies amenazadas (IUCN)',
   'Otro'
]

export const areasTemAgroecologico = [
    'Agricultura agroecológica (grandes productores)',
    'Agricultura familiar y Huertas comunitarias (pequeños productores)',
    'Compostaje comunitario',
    'Divulgación y Educación',
    'Ganadería holista o Pastoreo racional',
    'Legislación',
    'Nodos y ferias',
    'RENAMA',
    'Semillas orgánicas',
    'Viveros',
    'Otro',
]
export const areastemAmbienteysoc = [
    'Actividad agropecuaria',
    'Actividad forestal',
    'Actividad hidrocarburífera',
    'Actividad minera',
    'Actividad pesquera',
    'Actividades urbanas',
    'Actividades de Ciencia y Tecnología referidas al ambiente',
    'Asambleas, ONGs, grupos en defensa del ambiente',
    'Basurales de hidrocarburos',
    'Basurales o Vertederos',
    'Cambio climático: políticas o experiencias',
    'Conflictos en torno al acceso a agua potable',
    'Conflictos en torno a la tierra',
    'Conflictos con pueblos originarios',
    'Conflictos con producción de semillas transgénicas',
    'Conflictos con represas o hidroeléctricas',
    'Contaminación por uso de agroquímicos (agua, aire, suelo)',
    'Contaminación de cuerpos de agua',
    'Impactos de la actividad minera sobre glaciares',
    'Degradación ambiental por actividades extractivas',
    'Desarrollo e Investigación para la sustentabilidad ambiental',
    'Educación ambiental',
    'Energías renovables',
    'Experiencias de sustentabilidad ambiental',
    'Leyes ambientales',
    'Manejo sustentable de residuos',
    'Normativa ambiental (amparos, juicios, acciones legales, etc.)',
    'Políticas públicas ambientales nacionales, provinciales o locales',
    'Problemas de salud por agroquímicos',
    'Problemática forestal (incendios, humedales, etc.)',
    'Problemática de residuos',
    'Quemas en basurales',
    'Recolectores o separadores',
    'Resistencias a la megaminería',
    'Transición energética',
    'Otro',
]

export const campoAplicacBiodiversidad = [
    'Ecología',
    'Eco-epidemiología',
    'Etología',
    'Genética',
    'Paleontología',
    'Socioecología',
    'Preservación',
    'Prevención y Control',
    'Restauración',
    'Uso sustentable',
    'Divulgación y Educación',
    'Legislación',
    'Otro',
]
export const campoAplicacSocYamb = [
    'Antropología',
    'Ciencia Política',
    'Derecho',
    'Divulgación y Educación',
    'Ecología Política',
    'Economía Ecológica',
    'Estado y Políticas Públicas',
    'Geografía',
    'Relaciones Internacionales',
    'Sociología',
    'Otros',
]
