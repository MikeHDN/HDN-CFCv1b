import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit, Save, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'analyst'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newUser.name || !newUser.email) {
        throw new Error('Name and email are required');
      }
      
      addUser({
        id: crypto.randomUUID(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'analyst',
        active: true
      });
      
      setNewUser({ name: '', email: '', role: 'analyst' });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    
    try {
      updateUser(editForm.id, editForm);
      setEditingId(null);
      setEditForm(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteUser(id);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New User Form */}
      <form onSubmit={handleAddUser} className="bg-gray-700 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="bg-gray-800 rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="bg-gray-800 rounded-lg px-4 py-2"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
            className="bg-gray-800 rounded-lg px-4 py-2"
          >
            <option value="admin">Admin</option>
            <option value="analyst">Analyst</option>
            <option value="operator">Operator</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </form>

      {/* User List */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Manage Users</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
            >
              {editingId === user.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={editForm?.name}
                    onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                    className="bg-gray-700 rounded-lg px-4 py-2"
                  />
                  <input
                    type="email"
                    value={editForm?.email}
                    onChange={(e) => setEditForm({ ...editForm!, email: e.target.value })}
                    className="bg-gray-700 rounded-lg px-4 py-2"
                  />
                  <select
                    value={editForm?.role}
                    onChange={(e) => setEditForm({ ...editForm!, role: e.target.value as User['role'] })}
                    className="bg-gray-700 rounded-lg px-4 py-2"
                  >
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                    <option value="operator">Operator</option>
                  </select>
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <span>{user.name}</span>
                  <span className="text-gray-400">{user.email}</span>
                  <span className="capitalize">{user.role}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 ml-4">
                {editingId === user.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 hover:bg-gray-700 rounded-lg text-green-500"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}