'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Howl } from 'howler'

export type PlaybackRate = 0.75 | 1 | 1.25 | 1.5

export function useAudio(src: string | null) {
  const howlRef = useRef<Howl | null>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rate, setRate] = useState<PlaybackRate>(1)
  const [loop, setLoop] = useState(false)
  const rafRef = useRef<number>(0)

  const updateSeek = useCallback(() => {
    if (howlRef.current && playing) {
      setSeek(howlRef.current.seek() as number)
      rafRef.current = requestAnimationFrame(updateSeek)
    }
  }, [playing])

  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(updateSeek)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, updateSeek])

  useEffect(() => {
    if (!src) return
    howlRef.current?.unload()
    setLoading(true)
    setPlaying(false)
    setSeek(0)
    setDuration(0)

    const h = new Howl({
      src: [src],
      html5: true,
      rate,
      loop,
      onload: () => {
        setDuration(h.duration())
        setLoading(false)
      },
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => { setPlaying(false); setSeek(0) },
      onend: () => { setPlaying(false); setSeek(0) },
      onloaderror: () => setLoading(false),
    })
    howlRef.current = h

    return () => { h.unload(); howlRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  function togglePlay() {
    const h = howlRef.current
    if (!h) return
    if (h.playing()) h.pause()
    else h.play()
  }

  function seekTo(val: number) {
    howlRef.current?.seek(val)
    setSeek(val)
  }

  function changeRate(r: PlaybackRate) {
    setRate(r)
    howlRef.current?.rate(r)
  }

  function toggleLoop() {
    const next = !loop
    setLoop(next)
    howlRef.current?.loop(next)
  }

  function stop() {
    howlRef.current?.stop()
  }

  return { playing, duration, seek, loading, rate, loop, togglePlay, seekTo, changeRate, toggleLoop, stop }
}
