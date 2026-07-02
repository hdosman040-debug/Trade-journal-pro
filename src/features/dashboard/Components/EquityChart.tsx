import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";
import { EquityCurvePoint } from "../../../types/trade";

interface EquityChartProps {
  data: EquityCurvePoint[];
}

export function EquityChart({ data }: EquityChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize high-performance Canvas container
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#12141C" }, // matches bg-background-card
        textColor: "#9CA3AF",                                   // matches foreground-muted
        fontSize: 10,
        fontFamily: "JetBrains Mono, monospace",
      },
      grid: {
        vertLines: { color: "rgba(38, 41, 59, 0.3)" },         // subtle divider colors
        horzLines: { color: "rgba(38, 41, 59, 0.3)" },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: "#9CA3AF",
      },
      timeScale: {
        borderVisible: false,
        textColor: "#9CA3AF",
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: { color: "#3B82F6", labelBackgroundColor: "#181A24" },
        horzLine: { color: "#3B82F6", labelBackgroundColor: "#181A24" },
      },
      handleScale: false,
      handleScroll: false,
      autoSize: true, // Native auto-resizing during mobile screen orientation swaps
    });

    // 2. Add custom Area Series with professional trading aesthetics
    const areaSeries = chart.addAreaSeries({
      lineColor: "#3B82F6",             // custom-trade-long (Neon Blue)
      topColor: "rgba(59, 130, 246, 0.25)",
      bottomColor: "rgba(59, 130, 246, 0.0)",
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    // 3. Map custom data format to Lightweight Charts payload
    const formattedData = data.map((point) => ({
      time: point.date,
      value: point.balance,
    }));

    areaSeries.setData(formattedData);
    chart.timeScale().fitContent();

    // Preserve references for side effects and cleanup tasks
    chartRef.current = chart;
    seriesRef.current = areaSeries;

    // 4. Safely purge canvas on component unmount (avoids memory leaks & double-chart bugs)
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-56 bg-background-card rounded-xl border border-border p-3 overflow-hidden">
      <p className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase mb-1">
        Equity curve performance (USD)
      </p>
      <div ref={chartContainerRef} className="w-full h-44" />
    </div>
  );
}