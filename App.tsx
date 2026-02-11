import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import PDFSearchViewer from './components/PDFSearchViewer';
import { User, UserRole, VoterFile, FileStatus } from './types';
import { verifyPassword, hashPassword } from './services/authService';

// Initial constants
const ADMIN_PHONE = '01737654555';
const ADMIN_PASS_RAW = 'Votarlist#$%^&';

const AppContent: React.FC = () => {
  // --- State ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [files, setFiles] = useState<VoterFile[]>([]);
  const [viewingFile, setViewingFile] = useState<VoterFile | null>(null);
  
  // Login Form State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const location = useLocation();

  // --- Initialization ---
  useEffect(() => {
    const initApp = async () => {
      // 1. Setup Admin if not exists
      const adminHash = await hashPassword(ADMIN_PASS_RAW);
      const storedUsers = localStorage.getItem('voter_app_users');
      
      let appUsers: User[] = [];
      if (storedUsers) {
        appUsers = JSON.parse(storedUsers);
      }
      
      // Ensure Admin exists and is updated
      const adminIndex = appUsers.findIndex(u => u.username === ADMIN_PHONE);
      const adminUser: User = { 
        username: ADMIN_PHONE, 
        passwordHash: adminHash, 
        role: UserRole.ADMIN, 
        isBlocked: false 
      };

      if (adminIndex === -1) {
        appUsers.push(adminUser);
      } else {
        appUsers[adminIndex] = adminUser;
      }
      
      setUsers(appUsers);

      // 2. Load Mock Files
      const storedFiles = localStorage.getItem('voter_app_files');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    };

    initApp();
  }, []);

  // Persist Users
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('voter_app_users', JSON.stringify(users));
    }
  }, [users]);

  // Persist Files
  useEffect(() => {
     localStorage.setItem('voter_app_files', JSON.stringify(files));
  }, [files]);

  // --- Handlers ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const user = users.find(u => u.username === loginUser);
    
    if (!user) {
        setLoginError('ভুল ইউজার বা পাসওয়ার্ড');
        return;
    }

    if (user.isBlocked) {
        setLoginError('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে');
        return;
    }

    const isValid = await verifyPassword(loginPass, user.passwordHash);
    if (isValid) {
        setCurrentUser(user);
        setIsLoginOpen(false);
        setLoginUser('');
        setLoginPass('');
    } else {
        setLoginError('ভুল ইউজার বা পাসওয়ার্ড');
    }
  };

  const handleUpload = (metadata: any, fileObjects: { type: string, file: File }[]) => {
    if (!currentUser) return;

    const newFiles: VoterFile[] = fileObjects.map(fo => {
        // Construct name: #District:Upazila:Union:Ward:Para/Type
        const name = `#${metadata.district}:${metadata.upazila}:${metadata.union}:ওয়ার্ড-${metadata.ward}:${metadata.para}/${fo.type}`.replace(/\s+/g, '-');
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            uploadDate: Date.now(),
            uploadedBy: currentUser.username,
            status: FileStatus.UPLOADING,
            fileData: null, // In a real app, this would be the URL. Here we simulate.
            metadata: { ...metadata, type: fo.type }
        };
    });

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate OCR Process
    newFiles.forEach(nf => {
        setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === nf.id ? { ...f, status: FileStatus.PROCESSING } : f));
            
            // Finish processing after random time
            setTimeout(() => {
                 setFiles(prev => prev.map(f => f.id === nf.id ? { ...f, status: FileStatus.OCR_COMPLETE } : f));
            }, 3000 + Math.random() * 2000);

        }, 1500);
    });
  };

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleToggleBlock = (username: string) => {
    setUsers(users.map(u => u.username === username ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  // --- Render ---

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-slate-50">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        currentUser={currentUser} 
        onLogout={() => setCurrentUser(null)}
      />

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <Routes>
            <Route path="/" element={
                currentUser ? (
                   <Dashboard files={files} onUpload={handleUpload} onSelectFile={setViewingFile} />
                ) : (
                    <div className="text-center mt-20">
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">ভোটার লিস্ট ম্যানেজমেন্ট সিস্টেম</h2>
                        <p className="text-gray-500 mb-8">অনুগ্রহ করে লগইন করুন</p>
                        <button onClick={() => setIsLoginOpen(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:bg-emerald-700 transition">
                            লগইন করুন
                        </button>
                    </div>
                )
            } />
            <Route path="/omarfaruk" element={
                currentUser && currentUser.role === UserRole.ADMIN ? (
                    <AdminPanel users={users} onAddUser={handleAddUser} onToggleBlock={handleToggleBlock} />
                ) : (
                   <Navigate to="/" />
                )
            } />
        </Routes>
      </main>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="সিস্টেম লগইন">
         <div className="mb-4 bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
            পাসওয়ার্ড এর জন্য আপনার নিকটস্থ <strong>উপজেলা জামায়াত</strong> কর্তৃপক্ষের সাথে যোগাযোগ করুন।
         </div>
         <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">ইউজার আইডি / মোবাইল</label>
                <input 
                    type="text" 
                    value={loginUser} 
                    onChange={e => setLoginUser(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                <input 
                    type="password" 
                    value={loginPass} 
                    onChange={e => setLoginPass(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2"
                    required
                />
            </div>
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition">
                লগইন
            </button>
         </form>
      </Modal>

      {/* PDF Viewer Overlay */}
      {viewingFile && (
          <PDFSearchViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
}

export default App;