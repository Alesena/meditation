/**
 * Renderiza texto con formato básico:
 * - Saltos de línea preservados
 * - Líneas con "1." "2." etc. → items de lista numerada
 * - Líneas con "- " o "• " → items de lista con viñeta
 * - Líneas vacías → espacio entre párrafos
 * - **texto** → negrita
 */
export function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n')

  const parsed = lines.map((line, i) => {
    const trimmed = line.trim()

    // Línea vacía → separador
    if (trimmed === '') {
      return <div key={i} className="h-2" />
    }

    // Lista numerada: "1. texto", "2. texto"
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2">
          <span className="font-semibold text-lavender-500 shrink-0 min-w-[1.25rem]">
            {numberedMatch[1]}.
          </span>
          <span>{renderInline(numberedMatch[2])}</span>
        </div>
      )
    }

    // Lista con viñeta: "- texto" o "• texto"
    const bulletMatch = trimmed.match(/^[-•]\s+(.+)$/)
    if (bulletMatch) {
      return (
        <div key={i} className="flex gap-2">
          <span className="text-sage-400 shrink-0">•</span>
          <span>{renderInline(bulletMatch[1])}</span>
        </div>
      )
    }

    // Párrafo normal
    return <p key={i}>{renderInline(trimmed)}</p>
  })

  return (
    <div className={`text-sm leading-relaxed space-y-1 ${className}`}>
      {parsed}
    </div>
  )
}

/** Renderiza **negrita** dentro de una línea */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    return part
  })
}
