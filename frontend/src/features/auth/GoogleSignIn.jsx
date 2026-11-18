import { useEffect, useRef } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise = null
const loadScript = () => {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve()
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.defer = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Google Sign-In'))
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

export const GoogleSignIn = ({ onCredential, disabled }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!CLIENT_ID || !ref.current) return undefined
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !ref.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => onCredential?.(response.credential),
        })
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'outline',
          size: 'large',
          width: ref.current.offsetWidth || 300,
          text: 'continue_with',
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [onCredential])

  if (!CLIENT_ID) return null
  return <div ref={ref} className={disabled ? 'pointer-events-none opacity-50' : ''} />
}
