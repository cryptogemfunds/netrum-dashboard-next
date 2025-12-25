'use client'

export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`
        card
        p-5
        min-h-[140px]
        shadow-md
        ${className}
      `}
    >
      {title && (
        <div className="text-sm text-neutral-400 mb-3 font-semibold">
          {title}
        </div>
      )}

      {children}
    </div>
  )
}
