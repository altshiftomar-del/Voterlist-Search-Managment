// @ts-nocheck
const { useState } = window.React;
const { UserRole } = window;
const { hashPassword } = window.authService;

window.AdminPanel = ({ users, onAddUser, onToggleBlock }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState(UserRole.USER);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if(!newUsername || !newPassword) return;

    // Check existing
    if(users.find(u => u.username === newUsername)) {
        alert('এই নামের ইউজার ইতিমধ্যে আছে');
        return;
    }

    setIsCreating(true);
    const hash = await hashPassword(newPassword);
    
    const newUser = {
        username: newUsername,
        passwordHash: hash,
        role: newRole,
        isBlocked: false
    };

    onAddUser(newUser);
    setNewUsername('');
    setNewPassword('');
    setNewRole(UserRole.USER);
    setIsCreating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">অ্যাডমিন প্যানেল (OmarFaruk)</h2>

        {/* Create User */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-emerald-700">নতুন ইউজার তৈরি করুন</h3>
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="ইউজারনেম" 
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="flex-1 p-2 border rounded focus:border-emerald-500 focus:outline-none"
                    required
                />
                <input 
                    type="password" 
                    placeholder="পাসওয়ার্ড" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="flex-1 p-2 border rounded focus:border-emerald-500 focus:outline-none"
                    required
                />
                <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="p-2 border rounded focus:border-emerald-500 focus:outline-none bg-white"
                >
                    <option value={UserRole.USER}>User</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
                <button 
                    type="submit" 
                    disabled={isCreating}
                    className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
                >
                    তৈরি করুন
                </button>
            </form>
        </div>

        {/* User List */}
        <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">ইউজার তালিকা</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 uppercase font-medium text-gray-600">
                        <tr>
                            <th className="px-4 py-3">ইউজারনেম</th>
                            <th className="px-4 py-3">রোল</th>
                            <th className="px-4 py-3">স্ট্যাটাস</th>
                            <th className="px-4 py-3 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.username} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{user.username}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {user.isBlocked ? (
                                        <span className="text-red-600 font-bold">BLOCKED</span>
                                    ) : (
                                        <span className="text-green-600">Active</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {user.role !== UserRole.ADMIN && (
                                        <button 
                                            onClick={() => onToggleBlock(user.username)}
                                            className={`px-3 py-1 rounded text-xs font-bold ${user.isBlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {user.isBlocked ? 'আনলক করুন' : 'ব্লক করুন'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};