import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface QueryCondition {
  field: string;
  operator: string;
  value: string;
}

const QueryBuilder = () => {
  const [conditions, setConditions] = useState<QueryCondition[]>([
    { field: '', operator: 'equals', value: '' }
  ]);

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Query Builder</h2>
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="flex gap-4 items-center">
            <select
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={condition.field}
              onChange={(e) => {
                const newConditions = [...conditions];
                newConditions[index].field = e.target.value;
                setConditions(newConditions);
              }}
            >
              <option value="">Select field</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
            </select>
            
            <select
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={condition.operator}
              onChange={(e) => {
                const newConditions = [...conditions];
                newConditions[index].operator = e.target.value;
                setConditions(newConditions);
              }}
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="greater_than">Greater than</option>
              <option value="less_than">Less than</option>
            </select>
            
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
              value={condition.value}
              onChange={(e) => {
                const newConditions = [...conditions];
                newConditions[index].value = e.target.value;
                setConditions(newConditions);
              }}
            />
            
            <button
              onClick={() => removeCondition(index)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={addCondition}
        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add condition
      </button>
    </div>
  );
};

export default QueryBuilder;