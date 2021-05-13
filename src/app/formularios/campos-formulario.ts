import {Validators} from '@angular/forms';

export interface CamposFormulario {
  detalles: {
  projectid?: string,
  email?: string,
  tipo_enfoque?: string,
  nombre?: string,
  enfoque?: string,
  institucion?: string,
  titulo_extendido?: string,
  descripcion?: string,
  resumen?: string,
  tipo_estudio?: string,
  redes_sociales?: redesSociales,
  pais?: string,
  provincia?: string,
  ciudad?: string,
  estado_actual?: string,
  coordenadas?: string,
  ano_inicio?: string,
  web?: string,
  tipo_sitio?: string,
  resultados?: string,
  linksfotos?: [{ link?: string, descripcion?: string }]
  personal?: personal[],
  especies?: especies[]
}
}

export interface redesSociales {
  facebook?: string,
  instagram?: string,
  twitter?: string,
  youtube?: string,
  researchgate?: string,
}

export interface personal {
  nombre_apellido?: string,
  rol?: string,
  genero?: string,
  fecha_nacimiento?: string,
  pais_residencia?: string,
  provincia_residencia?: string,
  email_personal?: string, // , Validators.email
  redes_sociales_personal?: redesSociales
}

export interface especies {
  spob?:string,
  nombre_vulgar?: string,
  tso?:string
}

export const biodiversidad = [
  { item_id: 1, item_text: 'Fauna' },
  { item_id: 2, item_text: 'Vegetación' },
  { item_id: 3, item_text: 'Hongos' },
  { item_id: 5, item_text: 'Especies nativas' },
  { item_id: 6, item_text: 'Especies exóticas invasoras' },
  { item_id: 7, item_text: 'Especies en silvestría' },
  { item_id: 8, item_text: 'Especies en cautiverio' },
  { item_id: 4, item_text: 'Bacterias' },
  { item_id: 9, item_text: 'Otros' }
]

export const agroecologico = [
  { item_id: 1, item_text: 'Ferias' },
  { item_id: 2, item_text: 'Huertas comunitarias' },
  { item_id: 3, item_text: 'Nodos' },
  { item_id: 4, item_text: 'Campos' },
  { item_id: 5, item_text: 'Compostaje comunitario' },
  { item_id: 6, item_text: 'Viveros' },
  { item_id: 7, item_text: 'Otros' },
]
export const ambienteysoc = [
  { item_id: 1, item_text: 'Minería' },
  { item_id: 2, item_text: 'Manejo de residuos' },
  { item_id: 3, item_text: 'Contaminación' },
  { item_id: 4, item_text: 'Eco-epidemiología' },
  { item_id: 5, item_text: 'Cambio climático' },
  { item_id: 6, item_text: 'Pesqueras ilegales' },
  { item_id: 7, item_text: 'Política y ambiente' },
  { item_id: 8, item_text: 'Experiencias sustentables' },
  { item_id: 9, item_text: 'Otros' },
]

