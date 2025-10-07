
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Visualization } from '../types';
import { useTranslation } from 'react-i18next';

interface VisualizationRendererProps {
  visualization: Visualization;
}

const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 border border-secondary rounded-md shadow-lg">
        <p className="font-bold text-text-primary">{label}</p>
        <p className="text-sm text-primary">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ visualization }) => {
  const { type, title, data, columns } = visualization;
  const { t } = useTranslation();

  const renderChart = () => {
    if (!data || data.length === 0 || columns.length < 2) {
      return <p className="text-text-secondary">{t('visualization.noData')}</p>;
    }
    
    const nameKey = columns[0].key;
    const dataKey = columns[1].key;

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey={nameKey} stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}/>
              <Legend wrapperStyle={{fontSize: "14px", color: '#f1f5f9'}}/>
              <Bar dataKey={dataKey} name={columns[1].label} fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey={dataKey}
                        nameKey={nameKey}
                        // FIX: Replaced problematic `label` and `labelStyle` props with a custom label renderer.
                        // This fixes the TypeScript error with `percent` multiplication and the invalid `labelStyle` prop
                        // by returning a styled SVG <text> element, preserving functionality.
                        label={({ name, percent, x, y }) => (
                            <text x={x} y={y} fill="#f1f5f9" fontSize="12px" textAnchor="middle" dominantBaseline="central">
                                {`${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            </text>
                        )}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "14px", color: '#f1f5f9'}}/>
                </PieChart>
            </ResponsiveContainer>
        );
      case 'line':
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey={nameKey} stroke="#94a3b8" tick={{ fontSize: 12 }}/>
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }}/>
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }}/>
                    <Legend wrapperStyle={{fontSize: "14px", color: '#f1f5f9'}}/>
                    <Line type="monotone" dataKey={dataKey} name={columns[1].label} stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 8 }} dot={{strokeWidth: 2, fill: '#8B5CF6'}}/>
                </LineChart>
            </ResponsiveContainer>
        );
      case 'table':
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-text-secondary">
                    <thead className="text-xs text-text-primary uppercase bg-background/70">
                        <tr>
                            {columns.map(col => <th key={col.key} scope="col" className="px-6 py-3">{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="border-b border-secondary/50 hover:bg-background/50">
                                {columns.map(col => <td key={col.key} className="px-6 py-4 text-text-primary">{row[col.key]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
      default:
        return <p>{t('visualization.unsupported')}</p>;
    }
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4 text-text-primary">{title}</h4>
      {renderChart()}
    </div>
  );
};

export default VisualizationRenderer;