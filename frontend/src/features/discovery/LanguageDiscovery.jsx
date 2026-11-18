import { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import { languageService } from '../../services/users/userService'
import { LoadingState, EmptyState } from '../../components/ui/States'

export const LanguageDiscovery = () => {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    languageService.list()
      .then((list) => setLanguages(Array.isArray(list) ? list : []))
      .catch(() => setLanguages([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <header className="mb-6">
        <h2 className="font-display text-2xl font-bold">Language bridge</h2>
        <p className="mt-1 text-sm text-ink-2">
          Languages supported on the platform. Add your native language in Settings to meet
          people who share it.
        </p>
      </header>

      {loading ? (
        <LoadingState />
      ) : languages.length === 0 ? (
        <EmptyState title="No languages available" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((l) => (
            <div key={l.code} className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Languages className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{l.name}</p>
                {l.nativeName && l.nativeName !== l.name && (
                  <p className="truncate text-xs text-ink-3">{l.nativeName}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
