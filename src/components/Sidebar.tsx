
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  FileText, 
  BarChart, 
  Phone, 
  User, 
  MapPin, 
  Database, 
  Settings, 
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Departments', path: '/departments', icon: Database },
    { name: 'Complaints', path: '/complaints', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart },
    { name: 'Map View', path: '/map', icon: MapPin },
    { name: 'Emergency', path: '/emergency', icon: Phone },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gradient-to-r from-city-blue-400 to-city-green-400 p-1.5">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-city-blue-500 font-bold text-sm">CP</span>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-city-blue-500 to-city-green-500 bg-clip-text text-transparent">
              City Pulse
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-city-blue-50 text-city-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive(item.path) ? 'text-city-blue-500' : 'text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
