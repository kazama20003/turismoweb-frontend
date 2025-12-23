import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: number
  trend?: "up" | "down"
}

export function MetricCard({ title, value, icon: Icon, change, trend }: MetricCardProps) {
  const isPositive = trend === "up"

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className={isPositive ? "text-emerald-500" : "text-red-500"}>
              {isPositive ? "+" : ""}
              {change}%
            </span>
            vs mes anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
