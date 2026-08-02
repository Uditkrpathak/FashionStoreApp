import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export const RevenueChart = ({ monthlyStats = [], totalRevenue = 0, totalOrders = 0 }) => {
  const [metric, setMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Use 100% real database telemetry from monthlyStats; fallback to zeroed 12-month timeline if no orders exist yet
  const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dataPoints = (monthlyStats && monthlyStats.length > 0)
    ? monthlyStats
    : defaultMonths.map(m => ({ month: m, revenue: 0, orders: 0 }));

  const values = dataPoints.map(d => metric === 'revenue' ? d.revenue : d.orders);
  const maxVal = Math.max(...values, metric === 'revenue' ? 1000 : 10);
  const minVal = 0;

  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingY = 35;

  const points = dataPoints.map((d, i) => {
    const val = metric === 'revenue' ? d.revenue : d.orders;
    const x = paddingX + (i / (dataPoints.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal || 1)) * (height - paddingY * 2);
    return { x, y, val, label: d.month };
  });

  // Construct SVG smooth area path
  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  const peakPoint = points.reduce((max, pt) => pt.val > max.val ? pt : max, points[0] || { val: 0, label: '' });

  return (
    <div className="bg-white dark:bg-[#181926] p-6 sm:p-7 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-md transition-all">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
              {metric === 'revenue' ? 'Revenue Analytics Curve' : 'Order Volume Velocity'}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B] text-[#047857] dark:text-[#34D399] text-[10px] font-black">
              <TrendingUp className="w-3 h-3" /> Real-time
            </span>
          </div>
          <p className="text-xs font-medium text-[#797979] dark:text-[#A0AEC0] mt-1">
            Aggregated system order telemetry trajectory over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Peak Callout */}
          <div className="hidden md:flex flex-col items-end px-3 py-1 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl text-right">
            <span className="text-[9px] font-extrabold text-[#797979] uppercase">Peak Month ({peakPoint.label})</span>
            <span className="text-xs font-black text-[#704F38] dark:text-[#E8B84E]">
              {metric === 'revenue' ? `₹${peakPoint.val.toLocaleString('en-IN')}` : `${peakPoint.val} Orders`}
            </span>
          </div>

          {/* Metric Switcher */}
          <div className="flex items-center bg-[#FDFBF9] dark:bg-[#0F101C] p-1 rounded-xl border border-[#EDEDED] dark:border-[#2D2F45]">
            <button
              onClick={() => setMetric('revenue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metric === 'revenue'
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Revenue
            </button>
            <button
              onClick={() => setMetric('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metric === 'orders'
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Orders
            </button>
          </div>
        </div>
      </div>

      {/* SVG High Resolution Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#704F38" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#704F38" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartGradientDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8B84E" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#E8B84E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines with Y-Axis value labels */}
          <g className="grid-lines">
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#EDEDED" className="dark:stroke-[#2A2C3F]" strokeDasharray="4 4" />
            <text x={paddingX - 6} y={paddingY + 3} textAnchor="end" fontSize="9" fontWeight="700" fill="#A0AEC0">
              {metric === 'revenue' ? `₹${maxVal >= 1000 ? `${(maxVal/1000).toFixed(0)}k` : maxVal}` : maxVal}
            </text>

            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#EDEDED" className="dark:stroke-[#2A2C3F]" strokeDasharray="4 4" />
            <text x={paddingX - 6} y={height / 2 + 3} textAnchor="end" fontSize="9" fontWeight="700" fill="#A0AEC0">
              {metric === 'revenue' ? `₹${Math.round(maxVal / 2) >= 1000 ? `${(maxVal/2000).toFixed(0)}k` : Math.round(maxVal/2)}` : Math.round(maxVal/2)}
            </text>

            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#EDEDED" className="dark:stroke-[#2A2C3F]" />
            <text x={paddingX - 6} y={height - paddingY + 3} textAnchor="end" fontSize="9" fontWeight="700" fill="#A0AEC0">
              0
            </text>
          </g>

          {/* Area Fill */}
          <path
            d={areaD}
            fill="url(#chartGradient)"
            className="dark:hidden transition-all duration-300"
          />
          <path
            d={areaD}
            fill="url(#chartGradientDark)"
            className="hidden dark:block transition-all duration-300"
          />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#704F38"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#E8B84E] transition-all duration-300"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === idx ? "7" : "4.5"}
                fill={hoveredIdx === idx ? "#E8B84E" : "#704F38"}
                className="dark:fill-[#E8B84E] transition-all duration-200"
                stroke="#ffffff"
                strokeWidth="2.5"
              />

              {/* X Axis Label */}
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={hoveredIdx === idx ? "#704F38" : "#797979"}
                className={`transition-colors ${hoveredIdx === idx ? 'dark:fill-[#E8B84E] font-black' : 'dark:fill-[#A0AEC0]'}`}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute top-2 bg-[#1F2029] dark:bg-white text-white dark:text-[#1F2029] px-3.5 py-2 rounded-xl shadow-2xl text-xs font-extrabold z-20 pointer-events-none transform -translate-x-1/2 transition-all duration-150 border border-white/10"
            style={{ left: `${(points[hoveredIdx].x / width) * 100}%` }}
          >
            <div className="text-[10px] text-[#A0AEC0] dark:text-[#797979] uppercase">{points[hoveredIdx].label} Performance</div>
            <div className="text-[#E8B84E] dark:text-[#704F38] text-sm font-black mt-0.5">
              {metric === 'revenue' ? `₹${points[hoveredIdx].val.toLocaleString('en-IN')}` : `${points[hoveredIdx].val} Orders`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
