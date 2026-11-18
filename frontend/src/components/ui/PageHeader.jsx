export const PageHeader = ({ title, description, actions }) => (
  <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </header>
)
