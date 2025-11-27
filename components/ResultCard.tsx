import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { TypingStats, HistoryPoint } from "../types";
import {
  RefreshCcw,
  Home,
  Share2,
  Trophy,
  Activity,
  Zap,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ResultCardProps {
  stats: TypingStats;
  history: HistoryPoint[];
  onRetry: () => void;
  onHome: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  stats,
  history,
  onRetry,
  onHome,
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || history.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight || 200;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(history, (d) => d.second) || 0])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(history, (d) => d.wpm) || 100])
      .range([innerHeight, 0]);

    const area = d3
      .area<HistoryPoint>()
      .x((d) => x(d.second))
      .y0(innerHeight)
      .y1((d) => y(d.wpm))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const line = d3
      .line<HistoryPoint>()
      .x((d) => x(d.second))
      .y((d) => y(d.wpm))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Defs for Gradients
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "chartGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0.4);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0);

    // Axes
    const xAxis = d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerWidth).tickPadding(10);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr("class", "text-[10px] font-mono text-neutral-600")
      .select(".domain")
      .remove();

    g.append("g")
      .call(yAxis)
      .attr("class", "text-[10px] font-mono text-neutral-600")
      .select(".domain")
      .remove();

    g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.05)");

    // Draw Data
    g.append("path")
      .datum(history)
      .attr("fill", "url(#chartGradient)")
      .attr("d", area);

    g.append("path")
      .datum(history)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots for peaks? Maybe too cluttery. Keeping it clean.
  }, [history]);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Stat: WPM */}
        <div className="md:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-black to-transparent z-10"></div>

          <div className="relative z-20 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-green-500 fill-current" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                  Velocity
                </span>
              </div>
              <h3 className="text-8xl font-bold text-gray-900 dark:text-white font-mono tracking-tighter leading-none mb-4">
                {stats.wpm}
              </h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm max-w-xs">
                Words Per Minute. You are typing faster than 85% of engineers on
                CodeFlow.
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs text-neutral-600 font-bold uppercase tracking-widest mb-1">
                Raw Speed
              </div>
              <div className="text-3xl font-bold text-gray-700 dark:text-neutral-300 font-mono">
                {stats.rawWpm}
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy & Time Column */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-gray-300 dark:hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Precision
              </span>
              <span
                className={`text-2xl font-bold font-mono ${
                  stats.accuracy >= 98 ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {stats.accuracy}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-current text-green-500 transition-all duration-1000"
                style={{ width: `${stats.accuracy}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-gray-300 dark:hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Duration
              </span>
              <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                {Math.floor(stats.timeElapsed / 60)}:
                {String(stats.timeElapsed % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 mb-10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-green-500" />
              Flow Analysis
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Consistency metric over the session duration.
            </p>
          </div>
        </div>
        <div className="w-full h-[200px] md:h-[250px] relative z-10">
          <svg ref={chartRef} className="w-full h-full overflow-visible" />
        </div>
        {/* Background Grid for Chart */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onHome}
          className="px-8 py-4 rounded-full border border-gray-300 dark:border-white/10 bg-white dark:bg-black text-gray-500 dark:text-neutral-400 font-bold hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Home size={18} />
          Dashboard
        </button>

        <div className="flex w-full sm:w-auto gap-4">
          <button className="flex-1 sm:flex-none px-8 py-4 rounded-full bg-gray-100 dark:bg-[#151515] text-gray-900 dark:text-white font-bold border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-[#202020] transition-all flex items-center justify-center gap-2">
            <Share2 size={18} />
            Share
          </button>
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-none px-10 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
          >
            <RefreshCcw size={18} />
            Next Challenge
          </button>
        </div>
      </div>
    </div>
  );
};
