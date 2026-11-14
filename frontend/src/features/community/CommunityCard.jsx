export const CommunityCard = ({ id, name, cover, description, memberCount, hometown }) => {
  return (
    <div className="group rounded-2xl overflow-hidden bg-surface-primary border border-border hover:shadow-lg transition-shadow cursor-pointer">
      <img
        src={cover}
        alt={name}
        className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
      />
      <div className="p-5">
        <h3 className="font-medium text-token-text-caption line-clamp-2">{name}</h3>
        <p className="text-token-text-muted text-sm line-clamp-1 mt-2">{description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-token-text-muted text-xs">
            {hometown}
          </span>
          <span className="text-token-text-caption font-medium">
            {memberCount} members
          </span>
        </div>
      </div>
    </div>
  )
}