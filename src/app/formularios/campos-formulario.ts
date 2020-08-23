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
