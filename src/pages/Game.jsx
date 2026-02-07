// src/pages/MemoryRecall.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'

/*
  Memory Recall Game — مظهر مُحسّن للـ Light + Dark mode
  - الوظائف كما هي: preview -> اختفي -> اختر مكان الصورة المطلوبة
  - فقط تم تغيير الألوان، الحافات، الظلال، والمؤثرات البصرية
*/

const ALL_IMAGES = [
  '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg',
  '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg',
  '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg',
  '/bb.jpeg',
  'h.jpeg',
  '/k.jpeg',
  '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg',
]

const PREVIEW_SECONDS = 4
const IMAGE_COUNT = 6 // عدد الصور في الجولة

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GamePage() {
  const [selectedImages, setSelectedImages] = useState(() => shuffle(ALL_IMAGES).slice(0, IMAGE_COUNT))
  const [positions, setPositions] = useState([]) // ترتيب الصور عشوائياً
  const [preview, setPreview] = useState(true)
  const [timeLeft, setTimeLeft] = useState(PREVIEW_SECONDS)
  const [currentTargetIndex, setCurrentTargetIndex] = useState(null)
  const [guessed, setGuessed] = useState([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showResult, setShowResult] = useState(null) // { ok, correctPos }
  const previewTimerRef = useRef(null)

  // تجهيز المواقع عشوائياً عند بدء الجولة أو إعادة الترتيب
  useEffect(() => {
    const shuffledPositions = shuffle(selectedImages)
    setPositions(shuffledPositions)
    setPreview(true)
    setTimeLeft(PREVIEW_SECONDS)
    setGuessed([])
    setScore(0)
    setRound(0)
    setShowResult(null)
    setCurrentTargetIndex(null)
  }, [selectedImages])

  // عداد العرض المبدئي
  useEffect(() => {
    if (!preview) return
    previewTimerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(previewTimerRef.current)
          setPreview(false)
          setTimeout(() => pickNextTarget(), 350)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(previewTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview])

  function pickNextTarget() {
    const remaining = selectedImages.map((_, i) => i).filter(i => !guessed.includes(i))
    if (remaining.length === 0) {
      setCurrentTargetIndex(null)
      return
    }
    const pick = remaining[Math.floor(Math.random() * remaining.length)]
    setCurrentTargetIndex(pick)
    setRound(r => r + 1)
  }

  function handlePositionClick(posIndex) {
    if (preview) return
    if (currentTargetIndex === null) return
    if (guessed.includes(currentTargetIndex)) return

    const targetImage = selectedImages[currentTargetIndex]
    const correctPosIndex = positions.findIndex(src => src === targetImage)
    const ok = (posIndex === correctPosIndex)

    setShowResult({ ok, correctPos: correctPosIndex })

    if (ok) {
      setGuessed(prev => [...prev, currentTargetIndex])
      setScore(s => s + 1)
    }

    setTimeout(() => {
      setShowResult(null)
      const remaining = selectedImages.map((_, i) => i).filter(i => ![...guessed, ...(ok ? [currentTargetIndex] : [])].includes(i))
      if (remaining.length === 0) {
        setCurrentTargetIndex(null)
      } else {
        pickNextTarget()
      }
    }, 900)
  }

  function restart() {
    setSelectedImages(shuffle(ALL_IMAGES).slice(0, IMAGE_COUNT))
  }

  function formatSeconds(s) {
    return `${s}s`
  }

  const gridCols = 3
  const gridRows = Math.ceil(IMAGE_COUNT / gridCols)

  // ====== STYLES & CLASSES (light + dark friendly) ======
  // الخلفية: تدرّج ناعم للفاتح والداكن
  const containerClasses = `min-h-screen flex items-start justify-center py-8 px-4 
    bg-gradient-to-b from-pink-50 to-rose-100 dark:from-gray-950 dark:to-black transition-colors`

  const cardBase = `relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg transform-gpu will-change-transform`
  const cardBack = `absolute inset-0 flex items-center justify-center rounded-2xl text-white text-2xl font-bold`
  const btnPrimary = `px-3 py-2 rounded-full shadow-md text-sm transition active:scale-95`

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-3xl">
        {/* العنوان */}
        <div className="mb-4 text-center">
          <h1 className="text-lg font-extrabold text-gray-900 md:text-2xl dark:text-gray-100">
            Our best times together were all our times together.
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">نمط: تذكر مكان الصورة — احفظ ثم اختر المربع الصحيح</p>
        </div>

        {/* احصائيات وازرار */}
        <div className="flex flex-col gap-3 justify-between items-center mb-4 sm:flex-row">
          <div className="flex gap-4 items-center text-sm text-gray-700 dark:text-gray-300">
            <div className="px-3 py-1 rounded-full shadow-inner bg-white/60 dark:bg-white/5">الجولة: <strong className="mx-1">{round}</strong></div>
            <div className="px-3 py-1 rounded-full shadow-inner bg-white/60 dark:bg-white/5">النقاط: <strong className="mx-1">{score}</strong></div>
            <div className="px-3 py-1 rounded-full shadow-inner bg-white/60 dark:bg-white/5">المتبقي: <strong className="mx-1">{selectedImages.length - guessed.length}</strong></div>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={restart} className={`${btnPrimary} bg-white/90 dark:bg-gray-800`}>إعادة ترتيب</button>
            <button onClick={() => { setPreview(true); setPositions(shuffle(selectedImages)); setTimeLeft(PREVIEW_SECONDS) }} className={`text-white bg-rose-500 ${btnPrimary}`}>أعد المشاهدة</button>
          </div>
        </div>

        {/* شريط المعاينة أو الهدف */}
        {preview ? (
          <div className="px-3 py-2 mb-4 text-center rounded-xl shadow bg-white/80 dark:bg-gray-900/70">
            <div className="text-sm text-gray-700 dark:text-gray-200">احفظ أماكن الصور الآن — تختفي بعد <strong>{formatSeconds(timeLeft)}</strong></div>
          </div>
        ) : currentTargetIndex !== null ? (
          <div className="px-3 py-2 mb-4 text-center rounded-xl shadow bg-white/60 dark:bg-gray-900/60">
            <div className="text-sm text-gray-700 dark:text-gray-200">أين كانت هذه الصورة؟</div>
            <div className="inline-block overflow-hidden mt-2 w-28 h-20 rounded-lg ring-1 shadow-lg ring-white/20">
              <img src={encodeURI(selectedImages[currentTargetIndex])} alt="" className="object-cover w-full h-full" draggable={false} />
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 mb-4 text-center rounded-xl shadow bg-white/80 dark:bg-gray-900/70">
            <div className="text-sm text-gray-700 dark:text-gray-200">انتهت الجولة — نقاطك <strong>{score}</strong></div>
          </div>
        )}

        {/* الشبكة */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))`
          }}
        >
          {positions.map((src, idx) => {
            const isRevealed = preview || guessed.includes(selectedImages.findIndex(s => s === src)) || (showResult && showResult.correctPos === idx)
            const showCorrect = showResult && showResult.correctPos === idx
            const disableClick = preview || (currentTargetIndex === null) || guessed.includes(selectedImages.findIndex(s => s === src))

            // ألوان الحدود للحالة الحالية
            const borderStyle = showCorrect && showResult.ok ? 'ring-4 ring-green-400/70' :
              showCorrect && !showResult.ok ? 'ring-4 ring-red-400/70' : 'ring-1 ring-white/10'

            return (
              <motion.button
                key={idx}
                layout
                onClick={() => handlePositionClick(idx)}
                disabled={disableClick}
                whileTap={{ scale: 0.97 }}
                className={`${cardBase} ${borderStyle} focus:outline-none`}
                aria-label={`خانة ${idx + 1}`}
                style={{
                  background: preview ? 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))' : undefined,
                  boxShadow: '0 6px 18px rgba(2,6,23,0.12)'
                }}
              >
                {/* الصورة: تظهر أثناء preview أو بعد التخمين الصحيح أو عند إظهار النتيجة */}
                <img
                  src={encodeURI(src)}
                  alt=""
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
                  draggable={false}
                />

                {/* الوجه الخلفي: تصميم أنيق للنمطين */}
                <div className={`${cardBack} ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.95), rgba(236,72,153,0.75))',
                    backdropFilter: 'blur(6px)'
                  }}>
                  <div className="text-2xl text-white/95" aria-hidden>?</div>
                </div>

                {/* ايقونات النتائج */}
                {showResult && showResult.correctPos === idx && showResult.ok && (
                  <div className="flex absolute inset-0 justify-center items-center pointer-events-none">
                    <div className="p-2 font-bold text-green-600 rounded-full shadow bg-white/90">✔</div>
                  </div>
                )}
                {showResult && showResult.correctPos === idx && !showResult.ok && (
                  <div className="flex absolute inset-0 justify-center items-center pointer-events-none">
                    <div className="p-2 font-bold text-red-500 rounded-full shadow bg-white/90">✖</div>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* تحكمات إضافية */}
        <div className="flex flex-col gap-3 justify-between items-center mt-6 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-300">نمط: تذكر المكان — اضغط على المربع الذي كان يحتوي الصورة</div>
          <div className="flex gap-2 items-center">
            <button onClick={() => { setPositions(shuffle(positions)) }} className="px-3 py-2 rounded-full bg-white/90 dark:bg-gray-800">قَلِّب المواقع</button>
            <button onClick={() => { setPreview(true); setTimeLeft(PREVIEW_SECONDS) }} className="px-3 py-2 text-white bg-rose-500 rounded-full">مشاهدة سريعة</button>
          </div>
        </div>
      </div>
    </div>
  )
}
