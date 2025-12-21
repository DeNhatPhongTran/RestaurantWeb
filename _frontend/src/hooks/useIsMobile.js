import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if user is on mobile device
 * @param {number} breakpoint - Breakpoint in pixels (default: 768)
 * @returns {boolean} - True if mobile
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}
