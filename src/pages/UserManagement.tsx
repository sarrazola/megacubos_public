import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import UserTable from '../components/users/UserTable';
import UserForm from '../components/users/UserForm';
import { User, NewUser } from '../types/user';
import { fetchUsers, createUser, deleteUser } from '../services/api/users';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (userData: NewUser) => {
    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <UserTable users={users} onDeleteUser={handleDeleteUser} />

      {isModalOpen && (
        <UserForm
          onSubmit={handleAddUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;