import { Recharts } from '../charts/Recharts'

export const Dashboard = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <div className="rounded-2xl bg-surface-primary border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-4">Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-3xl font-bold">2,847</p>
                <p className="text-token-text-caption">Registered Users</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold">128</p>
                <p className="text-token-text-caption">Communities</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold">47</p>
              <p className="text-token-text-caption">Events this month</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <Recharts.BarChart data={[
            { name: 'Jan', users: 150 },
            { name: 'Feb', users: 200 },
            { name: 'Mar', users: 180 },
            { name: 'Apr', users: 220 },
            { name: 'May', users: 250 },
            { name: 'Jun', users: 280 },
          ]} />
        </div>
      </div>
    </section>
  )
}