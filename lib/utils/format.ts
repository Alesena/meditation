export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function getDayLabel(day: number): string {
  return `Día ${day}`
}

export const FRASES_MOTIVACIONALES = [
  '¡Increíble! Cada paso cuenta en tu camino hacia la paz interior. 🌿',
  'Has completado otro día. Tu constancia es tu mayor fortaleza. ✨',
  '¡Un día más de consciencia plena! Estás floreciendo. 🌸',
  'La meditación es un regalo que te das a ti misma. Bien hecho. 💜',
  '¡Sigue así! Tu mente agradece este momento de quietud. 🌙',
  'Cada día meditado es un día ganado para tu bienestar. 🙏',
]

export function getFraseAleatoria(): string {
  return FRASES_MOTIVACIONALES[Math.floor(Math.random() * FRASES_MOTIVACIONALES.length)]
}
