export const Moderation = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Content Moderation</h2>
          <p className="font-body text-token-text-secondary">
            Review reported content and manage community posts.
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 border-b font-medium text-token-text-caption">Reported Content</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Type</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Reason</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Status</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">
                  <p className="font-medium">Post: "Exploring Bangalore tech scene"</p>
                  <p className="text-token-text-muted text-xs">2 hours ago</p>
                </td>
                <td className="p-3">Post</td>
                <td className="p-3">Spam</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">Pending</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">Review</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  <p className="font-medium">Comment: "Nice post!"</p>
                  <p className="text-token-text-muted text-xs">5 hours ago</p>
                </td>
                <td className="p-3">Comment</td>
                <td className="p-3">Harassment</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-error/10 text-error">Resolved</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">Mark as resolved</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}