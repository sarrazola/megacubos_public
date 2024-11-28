import React from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface ChartComponentProps {
  data: any[];
  visualization?: 'line' | 'bar' | 'column' | 'area' | 'pie';
  xAxis?: string;
  yAxis?: string;
  strokeWidth?: number;
  height: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  visualization = 'line',
  xAxis = 'name',
  yAxis = 'value',
  strokeWidth = 2,
  height
}) => {
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  switch (visualization) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxis}
              stroke="#8884d8"
              strokeWidth={strokeWidth}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'column':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey={xAxis} type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={yAxis}
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height, height) / 3}
              fill="#8884d8"
              label
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};

export default ChartComponent;