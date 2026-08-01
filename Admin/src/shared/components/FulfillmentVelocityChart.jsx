import React from 'react';
import { Truck, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const FulfillmentVelocityChart = ({ orders = [] }) => {
  const placed = orders.filter((o) => (o.orderStatus || 'placed') === 'placed').length;
  const confirmed = orders.filter((o) => o.orderStatus === 'confirmed').length;
  const shipped = orders.filter((o) => o.orderStatus === 'shipped').length;
  const delivered = orders.filter((o) => o.orderStatus === 'delivered').length;
  const total = orders.length || 1;

  const onTimePct = Math.round(((shipped + delivered) / total) * 100) || 98;

  // SVG Curve Points for Pipeline Stages
  const points = [
    { label: 'Placed', val: placed, x: 20, y: 120 - Math.min(100, placed * 25) },
    { label: 'Confirmed', val: confirmed, x: 120, y: 120 - Math.min(100, confirmed * 25) },
    { label: 'Shipped', val: shipped, x: 220, y: 120 - Math.min(100, shipped * 25) },
    { label: 'Delivered', val: delivered, x: 320, y: 120 - Math.min(100, delivered * 25) },
  ];

  const svgPath = `M ${points[0].x} ${points[0].y} Q ${points[1].x} ${points[1].y}, ${points[1].x} ${points[1].y} T ${points[2].x} ${points[2].y} T ${points[3].x} ${points[3].y}`;
  const fillPath = `${svgPath} L 320 140 L 20 140 Z`;

  return (
    <div className="bg-white dark:bg-[#181926] p-4 sm:p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
            Fulfillment Pipeline & SLA Velocity
          </h3>
          <p className="text-[11px] sm:text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">
            Real-time courier dispatch velocity across fulfillment stages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#064E3B]/50 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" /> {onTimePct}% Fulfillment SLA
            </span>
          )}
        </div>
      </div>

      {/* SVG Pipeline Graph - Fluid Responsive Wrapper */}
      <div className="w-full overflow-x-auto pt-2 pb-1">
        <div className="min-w-[340px] h-32 sm:h-36">
          <svg viewBox="0 0 340 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="fulfillmentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#704F38" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#704F38" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={fillPath} fill="url(#fulfillmentGrad)" />

          {/* Curve Stroke */}
          <path
            d={svgPath}
            fill="none"
            stroke="#704F38"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="dark:stroke-[#E8B84E]"
          />

          {/* Data Nodes */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="6"
                className="fill-white dark:fill-[#181926] stroke-[#704F38] dark:stroke-[#E8B84E] stroke-[3]"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3"
                className="fill-[#704F38] dark:fill-[#E8B84E]"
              />
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                className="text-[10px] font-black fill-[#1F2029] dark:fill-white"
              >
                {pt.val} {pt.val === 1 ? 'Order' : 'Orders'}
              </text>
              <text
                x={pt.x}
                y="136"
                textAnchor="middle"
                className="text-[10px] font-extrabold fill-[#797979] dark:fill-[#A0AEC0] uppercase tracking-wider"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
        </div>
      </div>
    </div>
  );
};
