export const Users = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">User Management</h2>
          <p className="font-body text-token-text-secondary">
            Manage registered users and their roles.
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 border-b font-medium text-token-text-caption">User</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Email</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Role</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Status</th>
                <th className="p-3 border-b font-medium text-token-text-caption">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">John Doe</td>
                <td className="p-3">john@example.com</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    Member
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Active</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">View</button>
                  <button className="px-2 py-1 rounded border bg-token-error text-white text-sm">Remove</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Maria Garcia</td>
                <td className="p-3">maria@example.com</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-secondary/10 text-secondary">
                    Moderator
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">Suspended</span>
                </td>
                <td className="p-3">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <button className="px-6 py-3 rounded-lg bg-primary text-white font-medium">
            Invite New User
          </button>
        </div>
      </div>
    </section>
  )
}