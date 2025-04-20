
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 md:hidden bg-white border-b px-4 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className={`${navbarOpen ? 'block' : 'hidden'} md:block`}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      
      <div className="flex flex-1">
        {!isLoginPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className={`flex-grow p-4 md:p-6 transition-all duration-300 ${!isLoginPage ? (sidebarOpen ? 'md:ml-64' : 'ml-0') : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
