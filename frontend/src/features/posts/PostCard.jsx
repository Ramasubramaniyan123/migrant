export const PostCard = ({ id, author, authorImage, community, content, image, timestamp, likes, comments }) => {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-dark-dark border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21l-2-2-6-6l-2 2c-2 2-5.3 2-7.4 0l-2-2-6 6c-2 2-2 5 0 7l8 8 6-6z"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-token-text-caption">{author}</h3>
            <p className="text-token-text-muted text-xs">{timestamp}</p>
          </div>
        </div>

        <p className="mt-4 font-body line-clamp-3">{content}</p>

        {image && (
          <img
            src={image}
            alt={author}
            className="mt-4 w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:opacity-90"
          />
        )}

        <div className="mt-4 flex items-center gap-4 text-token-text-muted text-xs">
          <button className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-8-8 8v7c0 6 8 10 8 10z"/>
              <path d="M9 10v6m4 4v4m3-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
            </svg>
            {likes}
          </button>
          <button className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            {comments}
          </button>
          <button>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8m-8 8V5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}