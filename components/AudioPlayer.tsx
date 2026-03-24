'use client'

import { useAudio, type PlaybackRate } from '@/lib/hooks/useAudio'
import { formatTime } from '@/lib/utils/format'
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react'
import { Spinner } from './ui/Spinner'

const RATES: PlaybackRate[] = [0.75, 1, 1.25, 1.5]

export function AudioPlayer({ src, titulo }: { src: string; titulo: string }) {
  const { playing, duration, seek, loading, rate, loop, togglePlay, seekTo, changeRate, toggleLoop, stop } =
    useAudio(src)

  const progress = duration > 0 ? seek / duration : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600 truncate pr-4">{titulo}</p>
        <button
          onClick={toggleLoop}
          className={`p-1.5 rounded-lg transition-colors ${loop ? 'bg-sage-100 text-sage-600' : 'text-stone-400 hover:text-stone-600'}`}
          title="Loop"
        >
          <Repeat className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="group relative h-2 bg-stone-100 rounded-full cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          seekTo(pct * duration)
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-sage-500 shadow -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{formatTime(seek)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={stop}
          className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          title="Reiniciar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={togglePlay}
          disabled={loading}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-sage-500 hover:bg-sage-600 text-white shadow-md transition-all active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <Spinner size="sm" />
          ) : playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>

        {/* Speed control */}
        <div className="flex gap-1">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => changeRate(r)}
              className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                rate === r
                  ? 'bg-sage-500 text-white'
                  : 'text-stone-400 hover:bg-stone-100'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
