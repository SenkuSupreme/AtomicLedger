
'use client';

interface CalendarHeatmapProps {
  data: { date: string; count: number; pnl: number }[];
}

export default function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  // Generate last 365 days
  const days = Array.from({ length: 365 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (364 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensity = (dateStr: string) => {
    const dayData = data.find(d => d.date === dateStr);
    if (!dayData) return 'bg-white/5'; // Cell empty - very dark gray/transparent

    if (dayData.pnl > 0) {
        if (dayData.pnl > 1000) return 'bg-[#fff]';      // Brightest
        if (dayData.pnl > 500) return 'bg-[#ccc]';       // Med
        return 'bg-[#666]';                              // Low
    } else if (dayData.pnl < 0) {
        if (dayData.pnl < -1000) return 'bg-[#333]';     // Dark
        if (dayData.pnl < -500) return 'bg-[#444]';      // Med
        return 'bg-[#555]';                              // Light
    }
    return 'bg-white/10'; // Activity but PnL 0
  };


  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
         {/* Simple visualization: just a long strip for now, grid is complex to implement from scratch responsively without lib */}
         {days.map((day) => (
             <div 
               key={day} 
               className={`w-3 h-3 rounded-sm ${getIntensity(day)}`} 
               title={`${day}: ${data.find(d=>d.date===day)?.pnl || 0}`}
             />
         ))}
      </div>
    </div>
  );
}
