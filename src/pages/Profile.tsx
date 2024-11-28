import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { fetchUsers, updateUser } from '../services/api/users';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchUsers();
        if (users.length > 0) {
          setUser(users[0]);
          setFormData({
            name: users[0].name,
            email: users[0].email,
            phone: users[0].phone
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser(user.id, formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                  });
                }}
                className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-lg">{user.phone}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;