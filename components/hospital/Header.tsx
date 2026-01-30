'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Profile from './Profile';

interface HeaderProps {
  hospitalName: string;
  status: 'Online' | 'Offline';
}

export default function Header({ hospitalName, status }: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);

    try {
      // Clear any stored authentication tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      sessionStorage.clear();

      // If you're using cookies, you might want to call an API endpoint
      // await fetch('/api/auth/logout', { method: 'POST' });

      // If using NextAuth, uncomment:
      // await signOut({ redirect: false });

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to login page
      router.push('/login');
      
      // Optional: Force reload to clear any cached state
      // router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      // Still redirect even if there's an error
      router.push('/login');
    }
  };

  const handleProfile = () => {
    setIsProfileOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm backdrop-blur-lg bg-opacity-95 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left Section - Hospital Info */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">🏥</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight truncate">
                  {hospitalName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Emergency Dashboard
                </p>
              </div>
            </div>

            {/* Right Section - Status & User */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Combined Time & Status */}
              <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 ${
                status === 'Online' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className={`absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-ping ${
                      status === 'Online' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-bold ${
                      status === 'Online' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {status}
                    </p>
                    <p className="text-xs font-mono font-semibold text-gray-700 tabular-nums hidden sm:block">
                      {currentTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Profile Section */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 sm:space-x-3 sm:pl-4 sm:border-l-2 sm:border-gray-200 hover:bg-gray-50 px-2 sm:px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-gray-900">Dr. Admin</p>
                    <p className="text-xs text-gray-500">Emergency Coordinator</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-red-100 text-sm sm:text-base">
                      DA
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <svg 
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-40 overflow-hidden animate-slideDown">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-gray-900">Dr. Admin</p>
                        <p className="text-xs text-gray-600">admin@hospital.com</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={handleProfile}
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Profile
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <svg className="w-4 h-4 mr-3 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Logging out...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-900">Logging out...</p>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}