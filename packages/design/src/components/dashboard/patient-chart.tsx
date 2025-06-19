"use client";

import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  Sector,
  XAxis,
} from "recharts";

import type { ChartConfig } from "@repo/design/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/design/components/ui/chart";
import { cn } from "@repo/design/lib/utils";

import { ChartStyle } from "../ui/chart";

export const description = "A stacked bar chart with a legend";
const chartData = [
  { month: "January 2024", adult: 186, teens: 80, children: 45 },
  { month: "February 2024", adult: 305, teens: 200, children: 95 },
  { month: "March 2024", adult: 237, teens: 120, children: 65 },
  { month: "April 2024", adult: 73, teens: 190, children: 85 },
  { month: "May 2024", adult: 209, teens: 130, children: 75 },
  { month: "June 2024", adult: 214, teens: 140, children: 80 },
  { month: "July 2024", adult: 245, teens: 160, children: 90 },
  { month: "August 2024", adult: 198, teens: 175, children: 95 },
  { month: "September 2024", adult: 267, teens: 145, children: 85 },
  { month: "October 2024", adult: 289, teens: 195, children: 105 },
  { month: "November 2024", adult: 234, teens: 165, children: 95 },
  { month: "December 2024", adult: 276, teens: 185, children: 100 },
  { month: "January 2025", adult: 296, teens: 205, children: 115 },
  { month: "February 2025", adult: 315, teens: 220, children: 125 },
  { month: "March 2025", adult: 287, teens: 190, children: 105 },
  { month: "April 2025", adult: 273, teens: 180, children: 95 },
  { month: "May 2025", adult: 309, teens: 210, children: 125 },
  { month: "June 2025", adult: 314, teens: 220, children: 130 },
  { month: "July 2025", adult: 325, teens: 230, children: 135 },
  { month: "August 2025", adult: 318, teens: 225, children: 130 },
  { month: "September 2025", adult: 332, teens: 235, children: 140 },
  { month: "October 2025", adult: 345, teens: 245, children: 145 },
  { month: "November 2025", adult: 338, teens: 240, children: 140 },
  { month: "December 2025", adult: 352, teens: 250, children: 150 },
  { month: "January 2026", adult: 365, teens: 260, children: 155 },
  //   { month: "February 2026", adult: 358, teens: 255, children: 150 },
  //   { month: "March 2026", adult: 372, teens: 265, children: 160 },
  //   { month: "April 2026", adult: 385, teens: 275, children: 165 },
  //   { month: "May 2026", adult: 378, teens: 270, children: 160 },
  //   { month: "June 2026", adult: 392, teens: 280, children: 170 },
  { month: "July 2026", adult: 405, teens: 290, children: 175 },
  { month: "August 2026", adult: 398, teens: 285, children: 170 },
  { month: "September 2026", adult: 412, teens: 295, children: 180 },
  { month: "October 2026", adult: 425, teens: 305, children: 185 },
  { month: "November 2026", adult: 418, teens: 300, children: 180 },
  //   { month: "December 2026", adult: 432, teens: 310, children: 190 },
  //   { month: "January 2027", adult: 445, teens: 320, children: 195 },
  //   { month: "February 2027", adult: 438, teens: 315, children: 190 },
  //   { month: "March 2027", adult: 452, teens: 325, children: 200 },
  //   { month: "April 2027", adult: 465, teens: 335, children: 205 },
  //   { month: "May 2027", adult: 458, teens: 330, children: 200 },
  //   { month: "June 2027", adult: 472, teens: 340, children: 210 },
  //   { month: "January 2024", adult: 186, teens: 80, children: 45 },
  //   { month: "February 2024", adult: 305, teens: 200, children: 95 },
  //   { month: "March 2024", adult: 237, teens: 120, children: 65 },
  //   { month: "April 2024", adult: 73, teens: 190, children: 85 },
  //   { month: "May 2024", adult: 209, teens: 130, children: 75 },
  //   { month: "June 2024", adult: 214, teens: 140, children: 80 },
  //   { month: "July 2024", adult: 245, teens: 160, children: 90 },
  //   { month: "August 2024", adult: 198, teens: 175, children: 95 },
  //   { month: "September 2024", adult: 267, teens: 145, children: 85 },
  //   { month: "October 2024", adult: 289, teens: 195, children: 105 },
  //   { month: "November 2024", adult: 234, teens: 165, children: 95 },
  //   { month: "December 2024", adult: 276, teens: 185, children: 100 },
  //   { month: "January 2025", adult: 296, teens: 205, children: 115 },
  //   { month: "February 2025", adult: 315, teens: 220, children: 125 },
  //   { month: "March 2025", adult: 287, teens: 190, children: 105 },
  //   { month: "April 2025", adult: 273, teens: 180, children: 95 },
  //   { month: "May 2025", adult: 309, teens: 210, children: 125 },
  //   { month: "June 2025", adult: 314, teens: 220, children: 130 },
  //   { month: "July 2025", adult: 325, teens: 230, children: 135 },
  //   { month: "August 2025", adult: 318, teens: 225, children: 130 },
  //   { month: "September 2025", adult: 332, teens: 235, children: 140 },
  //   { month: "October 2025", adult: 345, teens: 245, children: 145 },
  //   { month: "November 2025", adult: 338, teens: 240, children: 140 },
  //   { month: "December 2025", adult: 352, teens: 250, children: 150 },
  //   { month: "January 2026", adult: 365, teens: 260, children: 155 },
  //   { month: "February 2026", adult: 358, teens: 255, children: 150 },
  //   { month: "March 2026", adult: 372, teens: 265, children: 160 },
  //   { month: "April 2026", adult: 385, teens: 275, children: 165 },
  //   { month: "May 2026", adult: 378, teens: 270, children: 160 },
  //   { month: "June 2026", adult: 392, teens: 280, children: 170 },
  //   { month: "July 2026", adult: 405, teens: 290, children: 175 },
  { month: "August 2026", adult: 398, teens: 285, children: 170 },
];

const chartConfig = {
  adult: {
    label: "Adult",
    color: "var(--chart-1)",
  },
  teens: {
    label: "Teens",
    color: "var(--chart-2)",
  },
  children: {
    label: "Children",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PatientBarChart({
  amount = 500,
  percentage = 10,
  period = "this month",
}: {
  amount: number;
  percentage: number;
  period: string;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex items-center justify-between !p-0 sm:flex-row">
        <div className="px-4 py-2">
          <CardTitle className="text-muted-foreground font-normal">
            Total Patients
          </CardTitle>
          <CardDescription>
            <div className="mt-auto flex flex-1 items-center gap-2">
              <p className="text-4xl font-bold text-slate-900">{amount}</p>
              <div className="flex items-center gap-2">
                <p
                  className={cn("flex items-center gap-1 text-sm font-medium", {
                    "text-green-700": percentage > 0,
                    "text-red-700": percentage < 0,
                  })}
                >
                  {percentage > 0 ? (
                    <ArrowUp className="size-4 stroke-3" />
                  ) : (
                    <ArrowDown className="size-4 stroke-3" />
                  )}
                  {percentage}%
                </p>
                <p className="text-sm text-slate-500">{period}</p>
              </div>
            </div>
          </CardDescription>
        </div>

        <div className="mr-8 flex justify-center gap-4 rounded-md border bg-slate-100 px-2 py-1">
          {Object.entries(chartConfig).map(([key, value]) => {
            return (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
                <p>{value.label}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            barGap={20}
            height={30}
            maxBarSize={12}
            data={chartData}
            accessibilityLayer
            style={{ stroke: "#fff", strokeWidth: 5 }}
          >
            <CartesianGrid
              stroke="#eee"
              vertical={false}
              strokeDasharray="10 5"
              strokeWidth={1}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="adult"
              stackId="a"
              fill="var(--color-adult)"
              radius={20}
            />

            <Bar
              dataKey="teens"
              stackId="a"
              fill="var(--color-teens)"
              radius={20}
            />
            <Bar
              dataKey="children"
              stackId="a"
              fill="var(--chart-3)"
              barSize={20}
              radius={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export const pieChartDescription = "An interactive pie chart";

const categoryData = [
  { category: "Tooth Scaling", value: 2005, percent: 30, fill: "#6C63FF" },
  { category: "Dental Checkup", value: 965, percent: 25, fill: "#00B894" },
  { category: "Teeth Whitening", value: 2005, percent: 40, fill: "#636363" },
  {
    category: "Root Canal Treatment",
    value: 800,
    percent: 15,
    fill: "#A259FF",
  },
  { category: "Dental Filling", value: 600, percent: 20, fill: "#FF6B00" },
  {
    category: "Orthodontic Consultation",
    value: 258,
    percent: 10,
    fill: "#D72660",
  },
  { category: "X-Ray Examination", value: 350, percent: 5, fill: "#0091D5" },
];

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const total = categoryData.reduce((acc, item) => acc + item.value, 0);

export function PatientPieChart({
  duration = "January - June 2024",
}: {
  duration: string;
}) {
  const id = "pie-interactive";
  const [activePie, setActivePie] = React.useState<string>("");

  const activeIndex = React.useMemo(
    () => categoryData.findIndex((item) => item.category === activePie),
    [activePie],
  );

  const data = React.useMemo(() => {
    return categoryData.map((item) => ({
      ...item,
      fill: !activePie
        ? item.fill
        : item.category === activePie
          ? item.fill
          : "var(--color-slate-100)",
    }));
  }, [activePie]);

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <Card
        data-chart={id}
        className="flex flex-2 flex-col rounded-none border-t-0 border-r-2 border-b-0 border-l-0 shadow-none"
      >
        <ChartStyle id={id} config={pieChartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Patients by Treatments</CardTitle>
            <CardDescription>{duration}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <ChartContainer
            id={id}
            config={pieChartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <Pie
                className="cursor-pointer"
                style={{
                  stroke: "var(--color-background)",
                  strokeWidth: 5,
                }}
                cornerRadius={10}
                data={data}
                dataKey="value"
                nameKey="category"
                innerRadius={75}
                strokeWidth={5}
                activeIndex={activeIndex}
                onMouseEnter={(e: PieSectorDataItem) =>
                  setActivePie(e.name ?? "")
                }
                onMouseLeave={() => setActivePie("")}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 20}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {categoryData[activeIndex]?.value ?? total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {activePie ? activePie : "All Patients"}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4">
        {categoryData.map((item) => (
          <div
            key={item.category}
            onMouseEnter={() => setActivePie(item.category)}
            onMouseLeave={() => setActivePie("")}
            className={cn({
              "cursor-pointer rounded-md bg-slate-200 px-2 transition-all duration-300":
                item.category === activePie,
              "opacity-50": activePie && item.category !== activePie,
            })}
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.category}</span>
            </div>
            <div className="ml-4 flex items-center gap-1 text-sm">
              <span className="text-muted-foreground text-sm">
                {item.value}
              </span>
              <span className="text-muted-foreground/50">|</span>
              <span>{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
