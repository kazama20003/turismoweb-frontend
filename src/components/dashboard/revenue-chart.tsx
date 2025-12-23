"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  data: Array<{ _id: string; total: number; count: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sin datos disponibles</div>
  }

  const chartData = data.map((item) => ({
    date: new Date(item._id).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    revenue: item.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
        <Bar dataKey="revenue" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
