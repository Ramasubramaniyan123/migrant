import {
  BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart as RPieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#C2410C', '#1D4ED8', '#15803D', '#B45309', '#7C3AED', '#0F766E', '#BE185D', '#475569']

const axisStyle = { fontSize: 12, fill: 'var(--color-ink-3)' }
const tooltipStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-line)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--color-ink)',
}

export const BarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <RBarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
      <XAxis dataKey="name" tick={axisStyle} />
      <YAxis tick={axisStyle} allowDecimals={false} />
      <Tooltip contentStyle={tooltipStyle} />
      <Bar dataKey="users" fill="#C2410C" radius={[4, 4, 0, 0]} />
    </RBarChart>
  </ResponsiveContainer>
)

export const PieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <RPieChart>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </RPieChart>
  </ResponsiveContainer>
)
