import React from 'react'

declare module '@/components/Card' {
  const Card: React.FC<{
    title?: React.ReactNode
    children: React.ReactNode
    className?: string
  }>
  export default Card
}
