"use client";

import React from "react";
import { TrendingUp, Brain } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

interface PsychologyWidgetProps {
  stats: any;
  className?: string;
}

export default function PsychologyWidget({
  stats,
  className = "",
}: PsychologyWidgetProps) {
  
  // Color mapping logic for different emotions
  const getEmotionColor = (emotion: string) => {
    const e = emotion.toLowerCase();
    if (e.includes("discipline") || e.includes("control")) return "#10b981"; // Emerald
    if (e.includes("focus") || e.includes("flow")) return "#3b82f6"; // Blue
    if (e.includes("patience") || e.includes("wait")) return "#8b5cf6"; // Violet
    if (e.includes("confidence") || e.includes("win")) return "#f59e0b"; // Amber
    if (e.includes("fear") || e.includes("panic")) return "#ef4444"; // Red
    if (e.includes("greed") || e.includes("fomo")) return "#f97316"; // Orange
    if (e.includes("stress") || e.includes("anger")) return "#ec4899"; // Pink
    return "#64748b"; // Slade fallback
  };

  // Transform real stats data
  let chartData: any[] = [];
  let dominantEmotion = { name: "N/A", percent: 0, count: 0 };

  if (stats?.emotionBreakdown && Object.keys(stats.emotionBreakdown).length > 0) {
    const total = Object.values(stats.emotionBreakdown).reduce((a: any, b: any) => a + b, 0) as number;
    
    chartData = Object.entries(stats.emotionBreakdown)
      .map(([emotion, count]) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        score: count,
        fill: getEmotionColor(emotion)
      }))
      .sort((a: any, b: any) => b.score - a.score) // Sort by highest count
      .slice(0, 5); // Take top 5

    if (chartData.length > 0) {
      dominantEmotion = {
        name: chartData[0].emotion,
        count: chartData[0].score,
        percent: Math.round((chartData[0].score / total) * 100)
      };
    }
  } else {
    // Fallback Mock Data
    chartData = [
      { emotion: "Discipline", score: 8, fill: "#10b981" },
      { emotion: "Focus", score: 6, fill: "#3b82f6" },
      { emotion: "Patience", score: 5, fill: "#8b5cf6" },
      { emotion: "Confidence", score: 4, fill: "#f59e0b" },
      { emotion: "Stress", score: 2, fill: "#ef4444" },
    ];
    dominantEmotion = { name: "Discipline", percent: 32, count: 8 };
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 dark:text-muted-foreground">Neural State</span>
           </div>
           <div className="flex flex-col">
              <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase">Psychology</h3>
               <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                 Emotional Dominance
                </p>
           </div>
        </div>
        <div className="p-3 bg-foreground/5 rounded-2xl border border-border text-purple-500/80">
          <Brain size={20} />
        </div>
      </div>

      <div className="w-full h-[300px] relative">
         <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={100} 
          >
             <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                          {payload[0].payload.emotion}
                        </p>
                        <p className="text-base font-black text-white tabular-nums">
                          {payload[0].value} <span className="text-xs font-normal text-white/50">Events</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            <RadialBar dataKey="score" background={{ fill: 'rgba(255,255,255,0.05)' }} cornerRadius={10}>
              <LabelList
                position="insideStart"
                dataKey="emotion"
                className="fill-white capitalize mix-blend-luminosity font-bold"
                fontSize={10}
              />
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 leading-none font-medium text-foreground/60 text-xs">
          Dominant State: 
          <span className={`font-bold uppercase ml-1 ${getEmotionColor(dominantEmotion.name).replace('bg-', 'text-').replace('/10', '')}`} style={{ color: getEmotionColor(dominantEmotion.name) }}>
            {dominantEmotion.name} ({dominantEmotion.percent}%)
          </span> 
          <TrendingUp className="h-3 w-3" style={{ color: getEmotionColor(dominantEmotion.name) }} />
        </div>
      </div>
    </div>
  );
}
