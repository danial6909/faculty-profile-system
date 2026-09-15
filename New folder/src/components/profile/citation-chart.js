"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function CitationChart({ data, color }) {
  const t = useTranslations("Chart");

  return (
    <div className="mt-4 h-40 w-full min-w-[240px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={160}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(15,23,42,0.04)" }}
            contentStyle={{
              direction: "ltr",
              fontFamily: "var(--font-brand)",
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #E2E8F0",
            }}
            formatter={(value) => [value, t("tooltipLabel")]}
            labelFormatter={(label) => t("yearLabel", { year: label })}
          />
          <Bar dataKey="citations" fill={color} radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
