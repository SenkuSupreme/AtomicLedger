
'use client';

import { useSession } from 'next-auth/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import React, { useState, useEffect } from 'react';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Target, BarChart2, TrendingUp, TrendingDown, Crosshair } from 'lucide-react';
import PortfolioSelector from '@/components/PortfolioSelector';
import DateRangePicker from '@/components/DateRangePicker';

const COLORS = ['#fff', '#333'];
import CreatePortfolioModal from '@/components/CreatePortfolioModal';
import { PlusCircle } from 'lucide-react';
import ForexSessionNavbar from '@/components/ForexSessionNavbar';

import { usePortfolios } from '@/context/PortfolioContext';

export default function Dashboard() {
  const { data: session } = useSession();
  const { portfolios, loading: portfoliosLoading, refreshPortfolios } = usePortfolios();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized fetcher for analytics stats
  const fetchStats = React.useCallback(async (id: string, range: { start: string, end: string }) => {
    setLoading(true);
    try {
        const queryParams = new URLSearchParams({ 
            portfolioId: id,
            ...(range.start && { startDate: range.start }),
            ...(range.end && { endDate: range.end })
        });

        const res = await fetch(`/api/analytics?${queryParams}`);
        const data = await res.json();
        setStats(data);
    } catch (error) {
        console.error('Analytics fetch error:', error);
    } finally {
        setLoading(false);
    }
  }, []);

  // Sync data whenever filters change
  useEffect(() => {
    if (!portfoliosLoading && portfolios.length > 0) {
        fetchStats(portfolioId, dateRange);
    }
  }, [portfolioId, dateRange, portfoliosLoading, portfolios.length, fetchStats]);

  if (portfoliosLoading) return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/60 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
          Syncing Accounts...
      </div>
  );

  // Empty State View
  if (!portfoliosLoading && portfolios.length === 0) {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
              <ForexSessionNavbar />
              <div className="max-w-md space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <BarChart2 size={32} className="text-white/60" />
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">No Active Portfolios</h1>
                  <p className="text-white/70 text-sm font-light leading-relaxed">
                      You haven't initialized any trading accounts yet. Create your first portfolio to start tracking your performance.
                  </p>
                  <div className="pt-6">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5 mx-auto"
                      >
                          <PlusCircle size={20} />
                          CREATE YOUR FIRST PORTFOLIO
                      </button>
                  </div>
              </div>

              <CreatePortfolioModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newPortfolio) => {
                    refreshPortfolios();
                    setPortfolioId(newPortfolio._id);
                }}
              />
          </div>
      );
  }

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Session Navbar */}
      <ForexSessionNavbar />

      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Overview</h1>
          <p className="text-white/70 text-sm font-medium">Real-time trading performance analytics.</p>
        </div>
        
        <div className="flex items-center gap-4">
             <DateRangePicker 
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={(start, end) => setDateRange({ start, end })}
             />
             <PortfolioSelector 
                currentId={portfolioId}
                onSelect={setPortfolioId}
             />
        </div>
      </div>

      {/* Progress Overlay */}
      {loading && (
          <div className="fixed top-0 left-0 w-full h-1 z-[100]">
              <div className="h-full bg-blue-500 animate-progress origin-left" />
          </div>
      )}

      {/* 1. Equity Curve - FULL WIDTH TOP */}
      <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 min-h-[450px] relative overflow-hidden group shadow-2xl">
              <div className="flex justify-between items-center mb-8 relative z-10">
                  <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Equity Curve</h3>
                      <p className="text-[11px] text-white/60 font-mono uppercase tracking-[0.2em]">Aggregate Account Growth</p>
                  </div>
                  <div className="flex gap-4 items-center">
                       <div className="text-right">
                           <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Current Balance</div>
                           <div className="text-2xl font-black text-white">${stats?.totalPnl?.toFixed(2) || '0.00'}</div>
                       </div>
                  </div>
              </div>

              <div className="h-[320px] w-full relative z-10">
                  {stats?.equityCurve && stats.equityCurve.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.equityCurve}>
                          <defs>
                          <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fff" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                          </linearGradient>
                          </defs>
                          <XAxis 
                              dataKey="name" 
                              stroke="#333" 
                              tick={{fill: '#888', fontSize: 11}} 
                              tickLine={false}
                              axisLine={false}
                              padding={{ left: 20, right: 20 }}
                          />
                          <YAxis 
                              stroke="#333" 
                              tick={{fill: '#888', fontSize: 11}}
                              tickLine={false} 
                              axisLine={false}
                              tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' }}
                              itemStyle={{ color: '#fff' }}
                              cursor={{ stroke: '#444', strokeWidth: 1 }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#fff" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorPnL)" 
                              animationDuration={1500}
                          />
                      </AreaChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="flex h-full items-center justify-center text-gray-700 font-mono text-xs border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                          <div className="flex flex-col items-center gap-2">
                              <Activity size={24} className="opacity-20" />
                              WATING FOR MARKET DATA...
                          </div>
                      </div>
                  )}
              </div>
               {/* Background grid effect */}
               <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>
      </div>

      {/* 2. Metrics Grid - MIDDLE */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <MetricCard 
            label="Total P&L" 
            value={`$${stats?.totalPnl?.toFixed(2) || '0.00'}`}
            subValue={stats?.totalPnl >= 0 ? '+12.5% this month' : '-2.3% this month'}
            trend={stats?.totalPnl >= 0 ? 'up' : 'down'}
            icon={<DollarSign size={16} />}
        />
        <MetricCard 
            label="Win Rate" 
            value={`${stats?.winRate || '0.0'}%`}
            subValue="Target: 60%"
            trend={parseFloat(stats?.winRate) > 50 ? 'up' : 'down'}
            icon={<Target size={16} />}
            tooltip="Percentage of trades that were profitable."
        />
        <MetricCard 
            label="Profit Factor" 
            value={stats?.profitFactor || '0.00'}
            subValue="> 1.5 is healthy"
            trend={parseFloat(stats?.profitFactor) > 1.5 ? 'up' : 'neutral'}
            icon={<Activity size={16} />}
            tooltip="Gross Profit divided by Gross Loss."
        />
        <MetricCard 
            label="Expectancy" 
            value={`$${stats?.expectancy || '0.00'}`}
            subValue="Per Trade"
            trend={parseFloat(stats?.expectancy) > 0 ? 'up' : 'down'}
            icon={<TrendingUp size={16} />}
            tooltip="Average amount you can expect to win (or lose) per trade."
        />
      </div>

      {/* 3. Secondary Stats & Heatmap - BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap & Secondary Metrics */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                    label="Avg R-Multiple" 
                    value={`${stats?.averageR || '0.00'}R`}
                    subValue="Target: > 2.0R"
                    trend={parseFloat(stats?.averageR) > 2 ? 'up' : 'neutral'}
                    icon={<Crosshair size={16} />}
                />
                <MetricCard 
                    label="Max Drawdown" 
                    value={`-$${stats?.maxDrawdown || '0.00'}`}
                    subValue="Peak to Valley"
                    trend="down"
                    icon={<TrendingDown size={16} />}
                />
                <MetricCard 
                    label="Total Trades" 
                    value={stats?.totalTrades || 0}
                    subValue="Cumulative"
                    trend="neutral"
                    icon={<BarChart2 size={16} />}
                />
            </div>

            {/* Heatmap */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
               <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Activity Map</h3>
                        <p className="text-[11px] text-white/60 font-mono uppercase tracking-[0.2em]">Trade Distribution</p>
                    </div>
               </div>
               {stats?.heatmap ? <CalendarHeatmap data={stats.heatmap} /> : <div className="text-white/60 text-sm">Initializing...</div>}
            </div>
        </div>

        {/* Side Panel: Insights & Win Rate */}
        <div className="space-y-6">
             {/* Insights Card */}
             <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
                 <h3 className="text-xl font-bold mb-1 text-white">Insights</h3>
                 <p className="text-[11px] text-white/60 font-mono uppercase tracking-[0.2em] mb-6">Key Takeaways</p>
                 
                 <div className="space-y-4">
                     {stats?.bestDay ? (
                        <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                            <p className="text-xs text-green-400 font-mono uppercase">Best Day</p>
                            <div className="flex justify-between items-end">
                                <p className="text-sm text-gray-300">{stats.bestDay.date}</p>
                                <p className="text-lg font-bold text-green-400">+${stats.bestDay.pnl.toFixed(2)}</p>
                            </div>
                        </div>
                     ) : null}

                     {stats?.worstDay ? (
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                            <p className="text-xs text-red-400 font-mono uppercase">Worst Day</p>
                            <div className="flex justify-between items-end">
                                <p className="text-sm text-gray-300">{stats.worstDay.date}</p>
                                <p className="text-lg font-bold text-red-400">${stats.worstDay.pnl.toFixed(2)}</p>
                            </div>
                        </div>
                     ) : null}
                 </div>
             </div>

             <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-1 text-white">Win Ratio</h3>
                <p className="text-[11px] text-white/60 font-mono uppercase tracking-[0.2em] mb-6">Performance Split</p>
                
                <div className="h-[200px] w-full flex items-center justify-center relative">
                    {(stats?.wins || 0) + (stats?.losses || 0) > 0 ? (
                        <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Wins', value: stats.wins },
                                        { name: 'Losses', value: stats.losses }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell key={`cell-win`} fill="#fff" />
                                    <Cell key={`cell-loss`} fill="#333" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                             <span className="text-3xl font-bold">{stats.winRate}%</span>
                             <span className="text-[10px] text-white/60 uppercase">Win Rate</span>
                        </div>
                        </>
                    ) : (
                        <div className="text-gray-600 font-mono text-xs">NO DATA</div>
                    )}
                </div>
                
                {(stats?.wins || 0) + (stats?.losses || 0) > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                         <div className="bg-white/5 rounded p-3 text-center border border-white/5">
                             <div className="text-lg font-bold text-white">{stats.wins}</div>
                             <div className="text-[10px] text-white/60 uppercase tracking-wider">Wins</div>
                         </div>
                         <div className="bg-white/5 rounded p-3 text-center border border-white/5">
                             <div className="text-lg font-bold text-white/70">{stats.losses}</div>
                             <div className="text-[10px] text-white/60 uppercase tracking-wider">Losses</div>
                         </div>
                    </div>
                )}
             </div>

             {/* Recent Activity Placeholder */}
             <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 h-fit">
                 <h3 className="text-lg font-bold mb-1">Recent Activity</h3>
                 <p className="text-xs text-white/60 font-mono uppercase tracking-widest mb-4">Latest Signals</p>
                 
                 <div className="space-y-3">
                     {[1,2,3].map(i => (
                         <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                             <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-gray-500" />
                                 <div className="text-sm text-white/70">Trade #{1000 + i} Logged</div>
                             </div>
                             <span className="text-xs text-gray-600 font-mono">2h ago</span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}

const MetricCard = React.memo(function MetricCard({ label, value, subValue, trend, icon, tooltip }: any) {
    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group relative" title={tooltip}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                {trend === 'up' && <ArrowUpRight size={16} className="text-green-500" />}
                {trend === 'down' && <ArrowDownRight size={16} className="text-red-500" />}
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mb-2">{value}</div>
            <div className="flex justify-between items-end">
                <div className="text-xs font-black text-white/50 uppercase tracking-[0.15em]">{label}</div>
                <div className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-white/60'}`}>
                    {subValue}
                </div>
            </div>
        </div>
    )
});

