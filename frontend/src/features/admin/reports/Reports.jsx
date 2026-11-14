export const Reports = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Reports</h2>
          <p className="font-body text-token-text-secondary">
            Manage reported content.
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 border-b font-medium text-token-text-caption">Report ID</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Reported By</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Content</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Reason</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Status</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">RPT-001</td>
                <td className="p-3">User123</td>
                <td className="p-3">Post: "Unauthorized content"</p>
                <td className="p-3">Inappropriate content</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">Pending</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">Review</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">RPT-002</td>
                <td className="p-3">User456</td>
                <td className="p-3">Comment: "Spam"</p>
                <td className="p-3">Spam</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Resolved</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">Mark resolved</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}