
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      <header className="bg-white text-gray-900 border-b border-gray-100 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <svg width="160" height="45" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path d="M25 25 C80 10, 160 10, 215 25" stroke="#f36523" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <text x="120" y="68" fontFamily="'Inter', sans-serif" fontSize="54" fontWeight="900" fill="#0083ca" letterSpacing="-2" textAnchor="middle">
                  VEPSUN
                </text>
              </svg>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-[#0083ca] uppercase tracking-[0.2em] leading-none">Enterprise Solutions</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mt-1">Admin Portal</span>
            </div>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <span className="px-4 py-1.5 bg-[#f36523] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">RHEL 10 CORE</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <svg width="140" height="40" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg" className="opacity-40 grayscale mb-6">
            <path d="M25 25 C80 10, 160 10, 215 25" stroke="#f36523" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <text x="120" y="68" fontFamily="'Inter', sans-serif" fontSize="54" fontWeight="900" fill="#0083ca" letterSpacing="-2" textAnchor="middle">
              VEPSUN
            </text>
          </svg>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] text-center max-w-md leading-relaxed">
            &copy; {new Date().getFullYear()} Vepsun Technologies. Specialized IT Training, Consulting & Global Assessment Solutions.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
