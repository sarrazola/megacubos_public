import React, { useState } from 'react';
import { Database, Server, Globe2, Boxes, Plus, Table2 } from 'lucide-react';
import TableBuilder from '../components/database/TableBuilder';
import DatabaseTable from '../components/database/DatabaseTable';
import { createDatabaseTable, checkTableExists, addToMasterTables, fetchTables } from '../services/api/database';

interface ResourceCard {
  id: string;
  name: string;
  icon: React.ReactNode | string;
  description: string;
  type: 'database' | 'api';
}

const Resources = () => {
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [currentTable, setCurrentTable] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  const resources: ResourceCard[] = [
    {
      id: 'megacubosdb',
      name: 'MegacubosDB',
      icon: <Database className="h-8 w-8 text-blue-500" />,
      description: 'Megacubos hosted PostgreSQL DB',
      type: 'database',
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: <Database className="h-8 w-8 text-blue-500" />,
      description: 'Open-source relational database',
      type: 'database',
    },
    {
      id: 'rest',
      name: 'REST API',
      icon: <Globe2 className="h-8 w-8 text-purple-500" />,
      description: 'RESTful API endpoints',
      type: 'api',
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      icon: <Boxes className="h-8 w-8 text-pink-500" />,
      description: 'Query language for APIs',
      type: 'api',
    },
  ];

  const handleResourceClick = async (resourceId: string) => {
    if (resourceId === 'megacubosdb') {
      try {
        const tablesList = await fetchTables();
        setTables(tablesList);
        setShowTableView(true);
      } catch (error) {
        console.error('Error fetching tables:', error);
        alert('Failed to fetch tables');
      }
    }
  };

  const handleCreateTable = async (tableName: string, fields: any[]) => {
    try {
      // Check if table already exists
      const exists = await checkTableExists(tableName);
      
      if (exists) {
        throw new Error(`A table named "${tableName}" already exists. Please choose a different name.`);
      }

      // Create the table
      await createDatabaseTable(tableName, fields);
      
      // Add to master_tables
      await addToMasterTables(tableName);
      
      // Update local state
      setTables([...tables, tableName]);
      setShowTableBuilder(false);
    } catch (error) {
      console.error('Error creating table:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while creating the table');
    }
  };

  if (showTableView) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-semibold">MegacubosDB Tables</h1>
          </div>
          <button
            onClick={() => setShowTableBuilder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Table
          </button>
        </div>

        {tables.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Table2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Tables Yet</h2>
            <p className="text-gray-600 mb-4">
              Create your first table to start managing your data
            </p>
            <button
              onClick={() => setShowTableBuilder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Table
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setCurrentTable(table)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Table2 className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">{table}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {showTableBuilder && (
          <TableBuilder
            onClose={() => setShowTableBuilder(false)}
            onSubmit={handleCreateTable}
          />
        )}

        {currentTable && (
          <DatabaseTable
            tableName={currentTable}
            onClose={() => setCurrentTable(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            onClick={() => handleResourceClick(resource.id)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              {typeof resource.icon === 'string' ? (
                <img src={resource.icon} alt={resource.name} className="h-8 w-8" />
              ) : (
                resource.icon
              )}
              <h3 className="text-lg font-semibold">{resource.name}</h3>
            </div>
            <p className="text-gray-600">{resource.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;