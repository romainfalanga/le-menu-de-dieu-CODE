import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from 'recharts';
import { DataPoint } from '../types';

interface RelativityChartProps {
  data: DataPoint[];
  markerData?: DataPoint;
  xLabel: string;
  yLabel: string;
  title: string;
 subtitle?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  referenceLines?: { x?: number; y?: number; label?: string }[];
}

export const RelativityChart: React.FC<RelativityChartProps> = ({
  data,
  markerData,
  xLabel,
  yLabel,
  title,
 subtitle,
  xDomain,
  yDomain,
  referenceLines = []
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{`${xLabel}: ${typeof label === 'number' ? label.toFixed(2) : label}`}</p>
          <p className="text-blue-600">{`${yLabel}: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    if (markerData && Math.abs(props.payload.x - markerData.x) < 0.01) {
      return <Dot {...props} r={6} fill="#ef4444" stroke="#dc2626" strokeWidth={2} />;
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center mb-2 sm:mb-3 lg:mb-4">
        <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h3>
       {subtitle && (
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 font-medium">{subtitle}</p>
       )}
      </div>
      <div className="h-48 sm:h-64 lg:h-80 xl:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ 
            top: 5, 
            right: 10, 
            left: 10, 
            bottom: 30 
          }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" opacity={0.6} />
          <XAxis
            dataKey="x"
            domain={xDomain}
            type="number"
            scale="linear"
            tick={{ fontSize: 9 }}
            label={{ 
              value: xLabel, 
              position: 'insideBottom', 
              offset: -3,
              style: { textAnchor: 'middle', fontSize: '10px', fontWeight: 'bold' }
            }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 9 }}
            label={{ 
              value: yLabel, 
              angle: -90, 
              position: 'insideLeft', 
              textAnchor: 'middle',
              style: { fontSize: '10px', fontWeight: 'bold' }
            }}
            width={50}
            tickCount={6}
            allowDataOverflow={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {referenceLines.map((ref, index) => (
            <React.Fragment key={index}>
              {ref.x && (
                <ReferenceLine
                  x={ref.x}
                  stroke="#6b7280"
                  strokeDasharray="5 5"
                  strokeOpacity={0.7}
                  label={{ 
                    value: ref.label, 
                    position: "top",
                    style: { fontSize: '9px', fontWeight: 'bold' }
                  }}
                />
              )}
              {ref.y && (
                <ReferenceLine
                  y={ref.y}
                  stroke="#6b7280"
                  strokeDasharray="5 5"
                  strokeOpacity={0.7}
                  label={{ 
                    value: ref.label, 
                    position: "right",
                    style: { fontSize: '9px', fontWeight: 'bold' }
                  }}
                />
              )}
            </React.Fragment>
          ))}
          
          <Line
            type="monotone"
            dataKey="y"
            stroke="url(#blueGradient)"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2 }}
          />
          
          {markerData && (
            <Line
              data={[markerData]}
              type="monotone"
              dataKey="y"
              stroke="#ef4444"
              strokeWidth={0}
              dot={{ r: 5, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 3 }}
            />
          )}
          
          {/* Définition des gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};