"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PopularDestinationsProps {
  tours: Array<{ _id: string; count: number; revenue: number; title: string }>
}

export function PopularDestinations({ tours }: PopularDestinationsProps) {
  if (!tours || tours.length === 0) {
    return <div className="text-sm text-muted-foreground">Sin datos disponibles</div>
  }

  const chartData = tours.slice(0, 5).map((tour) => ({
    name: tour.title.length > 20 ? tour.title.substring(0, 20) + "..." : tour.title,
    bookings: tour.count,
    revenue: tour.revenue,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" stroke="var(--muted-foreground)" />
        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={190} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Bar dataKey="bookings" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
        <Bar dataKey="revenue" fill="var(--chart-2)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
