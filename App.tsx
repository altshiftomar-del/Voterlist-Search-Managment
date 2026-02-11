// @ts-nocheck
const React = window.React;
const { useEffect, useState } = React;
const { HashRouter, Routes, Route, Navigate, useNavigate } = window.ReactRouterDOM;
const { Navbar, Modal, Dashboard, AdminPanel, PDFSearchViewer } = window;
const { UserRole, FileStatus } = window;
const { verifyPassword, hashPassword } = window.authService;

// Initial constants
const ADMIN_PHONE = '01737654555';
const ADMIN_PASS_RAW = 'Votarlist#$%^&';

const AppContent = () => {
  // --- State ---
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  
  // Login Form State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  // --- Initialization ---
  useEffect(() => {
    const initApp = async () => {
      // 1. Setup Admin if not exists
      const adminHash = await hashPassword(ADMIN_PASS_RAW);
      const storedUsers = localStorage.getItem('voter_app_users');
      
      let appUsers = [];
      if (storedUsers) {
        try {
          appUsers = JSON.parse(storedUsers);
        } catch (e) {
          console.error("Failed to parse users", e);
        }
      }
      
      // Ensure Admin exists and is updated
      const adminIndex = appUsers.findIndex(u => u.username === ADMIN_PHONE);
      const adminUser = { 
        username: ADMIN_PHONE, 
        passwordHash: adminHash, 
        role: UserRole.ADMIN, 
        isBlocked: false 
      };

      if (adminIndex === -1) {
        appUsers.push(adminUser);
      } else {
        // Update admin password if it changed in code
        appUsers[adminIndex] = adminUser;
      }
      
      setUsers(appUsers);

      // 2. Load Mock Files
      const storedFiles = localStorage.getItem('voter_app_files');
      if (storedFiles) {
        try {
            // Restore files but fileData (Blob URLs) cannot be restored from localStorage
            setFiles(JSON.parse(storedFiles));
        } catch (e) {
            console.error("Failed to parse files", e);
        }
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

  // Persist Files (Exclude fileData to avoid quota limits and invalid URLs)
  useEffect(() => {
     const filesToStore = files.map(f => ({ ...f, fileData: null }));
     localStorage.setItem('voter_app_files', JSON.stringify(filesToStore));
  }, [files]);

  // --- Handlers ---

  const handleLogin = async (e) => {
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
        // Redirect if admin
        if(user.role === UserRole.ADMIN) {
            navigate('/omarfaruk');
        } else {
            navigate('/');
        }
    } else {
        setLoginError('ভুল ইউজার বা পাসওয়ার্ড');
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      navigate('/');
  };

  const handleUpload = (metadata, fileObjects) => {
    if (!currentUser) return;

    const newFiles = fileObjects.map(fo => {
        // Construct name: #District:Upazila:Union:Ward:Para/Type
        const name = `#${metadata.district}:${metadata.upazila}:${metadata.union}:ওয়ার্ড-${metadata.ward}:${metadata.para}/${fo.type}`.replace(/\s+/g, '-');
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            uploadDate: Date.now(),
            uploadedBy: currentUser.username,
            status: FileStatus.UPLOADING,
            fileData: URL.createObjectURL(fo.file), // Create object URL for iframe
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

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleToggleBlock = (username) => {
    if (username === ADMIN_PHONE) return; // Prevent blocking admin
    setUsers(users.map(u => u.username === username ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  // --- Render ---

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-slate-50">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <Routes>
            <Route path="/" element={
                currentUser ? (
                   <Dashboard files={files} onUpload={handleUpload} onSelectFile={setViewingFile} />
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in">
                        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full">
                            <h2 className="text-3xl font-bold text-emerald-800 mb-4">ভোটার লিস্ট অনুসন্ধান</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                ডিজিটাল ভোটার লিস্ট ম্যানেজমেন্ট সিস্টেমে আপনাকে স্বাগতম। 
                                ভোটার লিস্ট আপলোড এবং অনুসন্ধান করতে লগইন করুন।
                            </p>
                            <button 
                                onClick={() => setIsLoginOpen(true)} 
                                className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition transform hover:-translate-y-1"
                            >
                                লগইন করুন
                            </button>
                        </div>
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
         <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-sm text-amber-900">
            <p className="font-bold">পাসওয়ার্ড প্রয়োজন?</p>
            <p>আপনার নিকটস্থ <strong className="text-amber-800">উপজেলা জামায়াত</strong> কর্তৃপক্ষের সাথে যোগাযোগ করুন।</p>
         </div>
         <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ইউজার আইডি / মোবাইল</label>
                <input 
                    type="text" 
                    value={loginUser} 
                    onChange={e => setLoginUser(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="01xxxxxxxxx"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
                <input 
                    type="password" 
                    value={loginPass} 
                    onChange={e => setLoginPass(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="********"
                    required
                />
            </div>
            {loginError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{loginError}</div>}
            <button type="submit" className="w-full bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition duration-200 shadow-md">
                লগইন করুন
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

window.App = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
}