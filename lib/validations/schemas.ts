import { z } from 'zod'

export const diaSchema = z.object({
  dia: z.coerce.number().min(1, 'Mínimo día 1').max(21, 'Máximo día 21'),
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  tarea: z.string().min(5, 'La tarea debe tener al menos 5 caracteres'),
  fraseDelDia: z.string().optional(),
})

export const entregaSchema = z.object({
  reflexion: z.string().min(1, 'Escribe tu reflexión del día'),
  comentario: z.string().optional(),
})

export type DiaSchemaType = z.infer<typeof diaSchema>
export type EntregaSchemaType = z.infer<typeof entregaSchema>
