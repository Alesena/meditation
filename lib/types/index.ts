import { Timestamp } from 'firebase/firestore'

export interface Dia {
  id: string
  dia: number
  titulo: string
  audioUrl: string
  descripcion: string
  tarea: string
  fraseDelDia?: string
  createdAt: Timestamp
}

export interface Entrega {
  id: string
  dia: number
  evidenciaUrl: string
  reflexion: string
  comentario?: string
  completado: boolean
  fechaEntrega: Timestamp
  userId: string
}

export interface AppConfig {
  fechaInicio?: Timestamp
  totalDias: number
}

export type DiaFormData = Omit<Dia, 'id' | 'createdAt' | 'audioUrl'> & {
  audioFile?: File
}

export type EntregaFormData = {
  reflexion: string
  comentario?: string
  evidenciaFile?: File
}
