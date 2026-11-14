export const LanguageBridge = () => {
  return (
    <div className="group hover:shadow-lg transition-shadow">
      <div className="rounded-2xl overflow-hidden bg-surface-primary p-6 hover:bg-primary transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage to-primary flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 7v6l4 2-4 2v-6c-2.76 0-5 2.24-5 5 0 .65.13 1.27.4 1.9l-3 8c-.18.48-.53.89-1 .95a4.98 4.98 0 0 1-.65.35c-2.31 0-4.17-1.95-4.17-4.36s1.86-4.36 4.17-4.36c.35 0 .68.02 1 .05v-3.5c0-1.23-.08-2.25-.3-3.15.83.4 1.58 1.06 1.96 1.88.38.83.68 1.67.92 2.28.75 2.21 1.79 4.33 3.06 5.16a11.958 11.958 0 0 1 2.2 1.75l.05.03a1 1 0 0 1-.07.26l-.2.85c-.08.38-.16.76-.22 1.13m8.16 1.75a8.967 8.967 0 0 1-2.4 1.75l-.05-.03c-.2-.54-.46-1.05-.66-1.53-.36-.79-.5-1.7-.5-2.75 0-1.86 1.52-3.35 3.37-3.93Z"/>
              <path d="M12 2v2"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-token-text-caption">Language Bridge</h3>
            <p className="text-token-text-muted text-sm line-clamp-2">
              Connect through shared languages and cultural affinity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}