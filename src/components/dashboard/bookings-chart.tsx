"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BookingsChartProps {
  data: Array<{ _id: string; total: number; count: number }>
}

export function BookingsChart({ data }: BookingsChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sin datos disponibles</div>
  }

  const chartData = data.map((item) => ({
    date: new Date(item._id).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    bookings: item.count,
    revenue: item.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: "var(--radius)",
          }}
        />
        <Line
          type="monotone"
          dataKey="bookings"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ fill: "var(--chart-1)", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
