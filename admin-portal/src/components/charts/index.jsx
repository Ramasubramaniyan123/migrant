import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart as ReAreaChart, Area } from 'recharts';

const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#64748b'];

function ChartCard({
  title,
  subtitle,
  children,
  className
}) {
  return (
    <div className={`card p-5 ${className ?? ''}`}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function getChartTheme() {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return {
    gridColor: isDark ? '#334155' : '#e2e8f0',
    cursorColor: isDark ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9',
    axisStyle: {
      fontSize: 11,
      fill: isDark ? '#94a3b8' : '#64748b'
    },
    tooltipStyle: {
      borderRadius: 8,
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontSize: 12,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.25)'
    }
  };
}

export function UserGrowthLineChart({ data }) {
  const { gridColor, axisStyle, tooltipStyle } = getChartTheme();

  return (
    <ChartCard title="User Growth" subtitle="Total vs daily active users — last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" tickFormatter={v => v.slice(5)} tick={axisStyle} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelFormatter={v => `Date: ${v}`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="users" name="Total users" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="activeUsers" name="Daily active" stroke="#10b981" strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function EngagementAreaChart({ data, dataKey = 'posts', name = 'Posts' }) {
  const { gridColor, axisStyle, tooltipStyle } = getChartTheme();

  return (
    <ChartCard title="Community Engagement" subtitle={`${name} per day — last 30 days`}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" tickFormatter={v => v.slice(5)} tick={axisStyle} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey={dataKey} name={name} stroke="#2563eb" strokeWidth={2} fill="url(#engagementFill)" />
        </ReAreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function LanguageDonutChart({ data }) {
  const { tooltipStyle } = getChartTheme();
  const top = data.slice(0, 7);
  const rest = data.slice(7);
  const chartData = rest.length
    ? [
        ...top,
        {
          language: 'Others',
          users: rest.reduce((s, d) => s + d.users, 0),
          percentage: rest.reduce((s, d) => s + d.percentage, 0)
        }
      ]
    : top;

  return (
    <ChartCard title="Language Distribution" subtitle="Users by mother tongue">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie data={chartData} dataKey="users" nameKey="language" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} layout="vertical" align="right" verticalAlign="middle" />
        </RePieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CityBarChart({ data }) {
  const { gridColor, cursorColor, axisStyle, tooltipStyle } = getChartTheme();

  return (
    <ChartCard title="Geographic Distribution" subtitle="Users by city">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="city" tick={axisStyle} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorColor }} />
          <Bar dataKey="users" name="Users" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GenericBarChart({ data, dataKey, name, color = '#2563eb', horizontal = false }) {
  const { gridColor, cursorColor, axisStyle, tooltipStyle } = getChartTheme();

  return (
    <ChartCard title={name}>
      <ResponsiveContainer width="100%" height="100%">
        {horizontal ? (
          <ReBarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} width={110} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorColor }} />
            <Bar dataKey={dataKey} name={name} fill={color} radius={[0, 4, 4, 0]} />
          </ReBarChart>
        ) : (
          <ReBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorColor }} />
            <Bar dataKey={dataKey} name={name} fill={color} radius={[4, 4, 0, 0]} />
          </ReBarChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  );
}
