import React, { useState, useEffect } from 'react';
import { Building2, Users, CreditCard, Pencil, Check, X } from 'lucide-react';
import { fetchCompanySettings, updateCompanyName, CompanySettings } from '../services/api/settings';

const Settings = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchCompanySettings();
      setSettings(data);
      setNewCompanyName(data.company_name);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !newCompanyName.trim()) return;

    try {
      const updated = await updateCompanyName(settings.id, newCompanyName.trim());
      setSettings(updated);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update company name');
      console.error('Error at updating company name:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewCompanyName(settings?.company_name || '');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Company Name</label>
              <div className="mt-1 flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewCompanyName(settings?.company_name || '');
                      }}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg">{settings?.company_name}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Subscription</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Current Plan</label>
              <p className="mt-1 text-lg">{settings?.plan}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Team</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Seats</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg">{settings?.seats_total}</span>
                <span className="text-sm text-gray-500">({settings?.seats_used} used)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;