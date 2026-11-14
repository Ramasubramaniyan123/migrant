export const EventCard = ({ id, title, organization, date, time, location, capacity, registered, image }) => {
  const capacityColor = registered / capacity > 0.8 ? 'bg-warning text-white' : 'text-token-text-muted'
  const capacityText = `${registered}/${capacity} registered`

  return (
    <div className="group rounded-2xl overflow-hidden bg-surface-primary border border-border hover:shadow-lg transition-shadow cursor-pointer">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:opacity-80"
        )
      }}
      <div className="p-5">
        <h3 className="font-medium text-token-text-caption line-clamp-2">{title}</h3>
        <p className="text-token-text-muted text-sm mb-2">
          {organization}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-token-text-caption">{date}</span>
          <span className="text-token-text-muted text-xs">·</span>
          <span className="text-token-text-caption">{time}</span>
        </div>
        <p className="text-token-text-caption text-sm">
          {location}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-token-text-caption ${capacityColor}`}>
            {capacityText}
          </span>
          <a href="#" className="text-token-accent font-small hover:underline">
            Join
          </a>
        </div>
      </div>
    </div>
  )
}