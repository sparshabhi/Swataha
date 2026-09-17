import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Zap,
  Clock,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ScenarioAttempt, DDAState } from '../types';

interface DDAGrowthChartProps {
  history: ScenarioAttempt[];
  currentDDA: DDAState;
}

type ChartViewMode = 'tier_and_elo' | 'pause_latency';

export const DDAGrowthChart = React.memo<DDAGrowthChartProps>(({ history, currentDDA }) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('tier_and_elo');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Prepare chronological data points (oldest to newest)
  const chartData = useMemo(() => {
    // If user has history, sort chronologically
    const rawList = history.length > 0 ? [...history].reverse() : [];

    return rawList.map((item, idx) => {
      // Calculate or estimate incremental ELO if not explicitly saved on legacy records
      const estimatedElo =
        item.skillRatingAfter ??
        1200 + idx * 18 + (item.isOptimal ? 15 : -10);

      return {
        trial: idx + 1,
        trialLabel: `Dilemma ${idx + 1}`,
        shortLabel: `#${idx + 1}`,
        title: item.scenarioTitle,
        tier: item.difficultyTier,
        skillRating: estimatedElo,
        timeTaken: item.timeTakenSeconds,
        isOptimal: item.isOptimal,
        score: item.score,
        flowScore: item.flowScore ?? (item.isOptimal ? 82 : 64),
        adjustmentNote: item.adjustmentNote,
        pausedEnough: item.pausedBeforeAnswering,
        timestamp: item.timestamp,
      };
    });
  }, [history]);

  // Compute trajectory statistics
  const trajectoryStats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        startingTier: currentDDA.currentTier,
        currentTier: currentDDA.currentTier,
        eloDelta: 0,
        optimalRate: 0,
        avgPauseTime: currentDDA.rollingAvgTime,
        tierTransitions: 0,
      };
    }

    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const eloDelta = last.skillRating - first.skillRating;
    const optimalCount = chartData.filter((d) => d.isOptimal).length;
    const optimalRate = Math.round((optimalCount / chartData.length) * 100);
    const avgPauseTime = Number(
      (
        chartData.reduce((acc, curr) => acc + curr.timeTaken, 0) /
        chartData.length
      ).toFixed(1)
    );

    // Count tier transitions
    let transitions = 0;
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].tier !== chartData[i - 1].tier) {
        transitions++;
      }
    }

    return {
      startingTier: first.tier,
      currentTier: currentDDA.currentTier,
      eloDelta,
      optimalRate,
      avgPauseTime,
      tierTransitions: transitions,
    };
  }, [chartData, currentDDA]);

  // Active highlighted point for drill-down
  const activeDetail = selectedPointIndex !== null && chartData[selectedPointIndex]
    ? chartData[selectedPointIndex]
    : chartData.length > 0
    ? chartData[chartData.length - 1]
    : null;

  // Custom Dot for Difficulty Tier Line
  const renderCustomTierDot = (props: any) => {
    const { cx, cy, payload, index } = props;
    if (cx === undefined || cy === undefined) return null;

    const isOptimal = payload.isOptimal;
    const isSelected = selectedPointIndex === index;

    return (
      <g
        key={`dot-${index}`}
        className="cursor-pointer transition-transform duration-200"
        onClick={() => setSelectedPointIndex(index)}
      >
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="none"
            stroke="#4A6B53"
            strokeWidth={2}
            strokeDasharray="2 2"
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 5 : 4}
          fill={isOptimal ? '#4A6B53' : '#E07A5F'}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </g>
    );
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-[#FAF9F5] border border-stone-300 rounded-xl shadow-lg max-w-xs text-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-1.5">
            <span className="font-bold text-stone-900">{data.trialLabel}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                data.isOptimal
                  ? 'bg-[#EAF0EB] text-[#4A6B53]'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {data.isOptimal ? 'Optimal Attunement' : 'Reactive Choice'}
            </span>
          </div>

          <div className="font-medium text-stone-800 line-clamp-1">{data.title}</div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-stone-600">
            <div>
              <span className="text-[10px] uppercase text-stone-600 font-bold block">
                Adaptive Tier
              </span>
              <span className="font-semibold text-[#4A6B53]">Tier {data.tier}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-600 font-bold block">
                Skill ELO
              </span>
              <span className="font-semibold text-[#C88A2E]">{data.skillRating} pts</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-600 font-bold block">
                Pause Duration
              </span>
              <span className="font-semibold text-stone-700">{data.timeTaken}s</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-600 font-bold block">
                Flow Score
              </span>
              <span className="font-semibold text-stone-700">{data.flowScore}%</span>
            </div>
          </div>

          {data.adjustmentNote && (
            <div className="pt-1.5 border-t border-stone-200/80 text-[11px] text-stone-600 italic">
              "{data.adjustmentNote}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-sm bg-[#4A6B53]/10 text-[#4A6B53] text-[10px] font-bold uppercase tracking-wider">
              Growth Trajectory
            </span>
            <span className="text-xs text-stone-500">
              Real-Time Dynamic Difficulty Calibration History
            </span>
          </div>
          <h2 className="font-editorial text-2xl text-stone-900 font-normal">
            Difficulty Adjustments & Skill Growth Trend
          </h2>
          <p className="text-xs text-stone-600 mt-0.5 leading-relaxed max-w-xl">
            Track how the DDA algorithm dynamically shifts scenario challenge tiers and modulates your ELO rating in response to your restorative choices and somatic pauses.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-stone-200/70">
          <button
            onClick={() => setViewMode('tier_and_elo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'tier_and_elo'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Tier & ELO Trend</span>
          </button>
          <button
            onClick={() => setViewMode('pause_latency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'pause_latency'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#C88A2E]" />
            <span>Somatic Pause Window</span>
          </button>
        </div>
      </div>

      {/* Trajectory Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Tier Progression */}
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
          <span className="text-[10px] uppercase font-bold text-stone-600 block">
            Tier Trajectory
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-editorial text-lg text-[#4A6B53] font-bold">
              Tier {trajectoryStats.startingTier}
            </span>
            <span className="text-stone-400 text-xs">→</span>
            <span className="font-editorial text-lg text-[#4A6B53] font-bold">
              Tier {trajectoryStats.currentTier}
            </span>
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">
            {trajectoryStats.tierTransitions} adaptive adjustment
            {trajectoryStats.tierTransitions === 1 ? '' : 's'}
          </div>
        </div>

        {/* ELO Rating Delta */}
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
          <span className="text-[10px] uppercase font-bold text-stone-600 block">
            Skill Growth (ELO)
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-editorial text-lg text-stone-900 font-bold">
              {currentDDA.skillRating}
            </span>
            <span
              className={`text-xs font-bold ${
                trajectoryStats.eloDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {trajectoryStats.eloDelta >= 0 ? `+${trajectoryStats.eloDelta}` : trajectoryStats.eloDelta}
            </span>
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">
            Net skill progression
          </div>
        </div>

        {/* Optimal Attunement Rate */}
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
          <span className="text-[10px] uppercase font-bold text-stone-600 block">
            Optimal Attunement
          </span>
          <div className="font-editorial text-lg text-stone-900 font-bold mt-0.5">
            {trajectoryStats.optimalRate}%
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">
            Restorative resolution rate
          </div>
        </div>

        {/* Avg Deliberate Pause */}
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
          <span className="text-[10px] uppercase font-bold text-stone-600 block">
            Avg Pause Window
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-editorial text-lg text-[#C88A2E] font-bold">
              {trajectoryStats.avgPauseTime}s
            </span>
            <span className="text-[10px] text-stone-600">/ trial</span>
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">
            Target window: 4–8s
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="relative pt-2">
        <div className="w-full h-72 min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'tier_and_elo' ? (
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setSelectedPointIndex(e.activeTooltipIndex);
                  }
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EFECE4"
                  vertical={false}
                />

                {/* X Axis: Trial sequence */}
                <XAxis
                  dataKey="shortLabel"
                  stroke="#A8A29E"
                  tick={{ fontSize: 11, fill: '#78716C' }}
                  tickLine={{ stroke: '#D6D3C7' }}
                  axisLine={{ stroke: '#D6D3C7' }}
                  dy={4}
                />

                {/* Left Y Axis: Difficulty Tier (1 to 5) */}
                <YAxis
                  yAxisId="tier"
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="#4A6B53"
                  tick={{ fontSize: 11, fill: '#4A6B53', fontWeight: 600 }}
                  tickFormatter={(val) => `Tier ${val}`}
                  axisLine={{ stroke: '#4A6B53', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#4A6B53' }}
                  width={54}
                />

                {/* Right Y Axis: Skill Rating (ELO) */}
                <YAxis
                  yAxisId="elo"
                  orientation="right"
                  domain={['dataMin - 40', 'dataMax + 40']}
                  stroke="#C88A2E"
                  tick={{ fontSize: 11, fill: '#C88A2E', fontWeight: 600 }}
                  tickFormatter={(val) => `${Math.round(val)}`}
                  axisLine={{ stroke: '#C88A2E', strokeWidth: 1.5 }}
                  tickLine={{ stroke: '#C88A2E' }}
                  width={48}
                />

                {/* Subtle Tier reference markers */}
                <ReferenceLine
                  yAxisId="tier"
                  y={2}
                  stroke="#4A6B53"
                  strokeDasharray="2 4"
                  strokeOpacity={0.4}
                />
                <ReferenceLine
                  yAxisId="tier"
                  y={3}
                  stroke="#4A6B53"
                  strokeDasharray="2 4"
                  strokeOpacity={0.4}
                />
                <ReferenceLine
                  yAxisId="tier"
                  y={4}
                  stroke="#4A6B53"
                  strokeDasharray="2 4"
                  strokeOpacity={0.4}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
                />

                {/* Primary Trend Line: Adaptive Tier */}
                <Line
                  yAxisId="tier"
                  type="monotone"
                  dataKey="tier"
                  name="Difficulty Tier"
                  stroke="#4A6B53"
                  strokeWidth={2.5}
                  dot={renderCustomTierDot}
                  activeDot={{ r: 7, fill: '#4A6B53', stroke: '#FFFFFF', strokeWidth: 2 }}
                />

                {/* Secondary Trend Line: Skill Rating (ELO) */}
                <Line
                  yAxisId="elo"
                  type="monotone"
                  dataKey="skillRating"
                  name="Skill Rating (ELO)"
                  stroke="#C88A2E"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#C88A2E', stroke: '#FFFFFF', strokeWidth: 1 }}
                  activeDot={{ r: 6, fill: '#C88A2E', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setSelectedPointIndex(e.activeTooltipIndex);
                  }
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EFECE4"
                  vertical={false}
                />

                <XAxis
                  dataKey="shortLabel"
                  stroke="#A8A29E"
                  tick={{ fontSize: 11, fill: '#78716C' }}
                  tickLine={{ stroke: '#D6D3C7' }}
                  axisLine={{ stroke: '#D6D3C7' }}
                  dy={4}
                />

                <YAxis
                  domain={[0, 16]}
                  stroke="#78716C"
                  tick={{ fontSize: 11, fill: '#78716C' }}
                  tickFormatter={(val) => `${val}s`}
                  axisLine={{ stroke: '#D6D3C7' }}
                  tickLine={{ stroke: '#D6D3C7' }}
                  width={40}
                />

                {/* Golden Zone Target Reference Area (4s to 8s) */}
                <ReferenceLine
                  y={4}
                  stroke="#4A6B53"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Min Pause (4s)',
                    position: 'insideTopLeft',
                    fill: '#4A6B53',
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  y={8}
                  stroke="#C88A2E"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Optimal Upper (8s)',
                    position: 'insideTopLeft',
                    fill: '#C88A2E',
                    fontSize: 10,
                  }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
                />

                <Line
                  type="monotone"
                  dataKey="timeTaken"
                  name="Pause Duration (s)"
                  stroke="#4A6B53"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#4A6B53', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#4A6B53' }}
                />

                <Line
                  type="monotone"
                  dataKey="flowScore"
                  name="Flow State Score (%)"
                  stroke="#C88A2E"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#C88A2E' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend Footnote */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-2 px-1 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" />
              <span>Green Dot = Optimal Restorative Response</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]" />
              <span>Coral Dot = Reactive / Procedural Fallback</span>
            </span>
          </div>
          <span>Click any point along the curve to inspect dilemma telemetry</span>
        </div>
      </div>

      {/* Selected Point Inspection Detail Box */}
      {activeDetail && (
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">
                {activeDetail.trialLabel}: {activeDetail.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeDetail.isOptimal
                    ? 'bg-[#EAF0EB] text-[#4A6B53]'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Tier {activeDetail.tier} · {activeDetail.isOptimal ? 'Attuned' : 'Reactive'}
              </span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              <span className="font-bold text-stone-700">DDA Engine Action: </span>
              {activeDetail.adjustmentNote || 'Dynamic difficulty calibrated to user pacing.'}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-stone-600 text-[11px] border-t sm:border-t-0 sm:border-l sm:pl-4 border-stone-200 pt-2 sm:pt-0">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Resulting ELO</span>
              <span className="font-bold text-[#C88A2E] text-xs">
                {activeDetail.skillRating} pts
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Pause Latency</span>
              <span className="font-bold text-stone-800 text-xs">
                {activeDetail.timeTaken}s
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Growth Trajectory Interpretive Insight Card */}
      <div className="p-4 rounded-xl bg-[#252525] text-stone-200 text-xs flex items-start gap-3 shadow-xs">
        <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white text-xs block">
            Pedagogical Growth Interpretation
          </span>
          <p className="text-stone-300 text-[11px] leading-relaxed">
            {trajectoryStats.currentTier > trajectoryStats.startingTier ? (
              <>
                You have advanced from <strong className="text-white">Tier {trajectoryStats.startingTier}</strong> to{' '}
                <strong className="text-emerald-400">Tier {trajectoryStats.currentTier}</strong>. The system has recognized
                your deliberate pause habituation ({trajectoryStats.avgPauseTime}s avg) and expanded the nuance of distractors,
                presenting more delicate school dilemmas.
              </>
            ) : trajectoryStats.optimalRate >= 70 ? (
              <>
                Your performance in <strong className="text-white">Tier {trajectoryStats.currentTier}</strong> is stabilizing with a{' '}
                <strong className="text-emerald-400">{trajectoryStats.optimalRate}% attunement rate</strong>. Continue holding the
                deliberate 4–8 second curious pause before responding to trigger the next dynamic promotion.
              </>
            ) : (
              <>
                The DDA engine is providing adaptive support in <strong className="text-white">Tier {trajectoryStats.currentTier}</strong>,
                expanding your decision window to prevent cognitive overload. Focus on observing the student's somatic cues before
                selecting a restorative option.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
});

DDAGrowthChart.displayName = 'DDAGrowthChart';

