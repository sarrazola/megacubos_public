import React from 'react';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import DataCard from '../components/data/DataCard';
import DataTable from '../components/data/DataTable';
import QueryBuilder from '../components/forms/QueryBuilder';

const Dashboard = () => {
  const mockData = {
    cards: [
      { title: 'Total Users', value: '1,234', change: 12.5, icon: <Users className="h-5 w-5 text-blue-600" /> },
      { title: 'Revenue', value: '$12,345', change: -2.4, icon: <DollarSign className="h-5 w-5 text-blue-600" /> },
      { title: 'Orders', value: '846', change: 8.2, icon: <ShoppingCart className="h-5 w-5 text-blue-600" /> },
      { title: 'Conversion', value: '2.4%', change: 4.1, icon: <Activity className="h-5 w-5 text-blue-600" /> }
    ],
    tableColumns: [
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Status', accessor: 'status' },
      { header: 'Last Active', accessor: 'lastActive' }
    ],
    tableData: [
      { name: 'John Doe', email: 'john@example.com', status: 'Active', lastActive: '2 hours ago' },
      { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', lastActive: '1 day ago' },
      { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', lastActive: '5 mins ago' },
      { name: 'Alice Brown', email: 'alice@example.com', status: 'Active', lastActive: '1 hour ago' }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.cards.map((card, index) => (
          <DataCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            columns={mockData.tableColumns}
            data={mockData.tableData}
          />
        </div>
        <div>
          <QueryBuilder />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;