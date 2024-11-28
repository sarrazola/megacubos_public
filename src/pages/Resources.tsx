import React, { useState } from 'react';
import { Database, Server, Globe2, Boxes } from 'lucide-react';

interface ResourceCard {
  id: string;
  name: string;
  icon: React.ReactNode | string;
  description: string;
  type: 'database' | 'api';
}

const Resources = () => {
  const [showPostgresConfig, setShowPostgresConfig] = useState(false);
  const [config, setConfig] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
  });

  const resources: ResourceCard[] = [
    {
      id: 'megacubosdb',
      name: 'MegacubosDB',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzNzM4OTkiLz48L3N2Zz4=',
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

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle connection configuration here
    console.log('PostgreSQL Config:', config);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            onClick={() => {
              if (resource.id === 'postgres') {
                setShowPostgresConfig(true);
              }
            }}
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

      {showPostgresConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">PostgreSQL Configuration</h2>
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host
                </label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="localhost"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="5432"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostgresConfig(false)}
                  className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;