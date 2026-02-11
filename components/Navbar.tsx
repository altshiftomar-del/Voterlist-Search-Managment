// @ts-nocheck
const React = window.React;
const { useNavigate } = window.ReactRouterDOM;
const { ScalesIcon } = window;
const { UserRole } = window;

window.Navbar = ({ onLoginClick, currentUser, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-white p-2 rounded-full text-emerald-700">
            <ScalesIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-wide hidden sm:block">ভোটার অনুসন্ধান</h1>
        </div>

        {/* Right: Login/User Info */}
        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{currentUser.username}</p>
                <p className="text-xs opacity-80">{currentUser.role === UserRole.ADMIN ? 'অ্যাডমিন' : 'ব্যবহারকারী'}</p>
              </div>
              
              {currentUser.role === UserRole.ADMIN && (
                 <button 
                  onClick={() => navigate('/omarfaruk')}
                  className="bg-emerald-800 hover:bg-emerald-900 px-3 py-2 rounded text-sm transition-colors border border-emerald-600 shadow-sm"
                >
                  অ্যাডমিন প্যানেল
                </button>
              )}

              <button 
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors shadow-sm"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-5 py-2 rounded shadow transition-colors"
            >
              লগইন
            </button>
          )}
        </div>
      </div>
    </header>
  );
};