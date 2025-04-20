
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm md:relative">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Button onClick={onMenuClick} variant="ghost" size="icon" className="md:hidden mr-2">
            <Menu />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-gradient-to-r from-city-blue-400 to-city-green-400 p-1.5">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-city-blue-500 font-bold text-sm">CP</span>
              </div>
            </div>
            <span className="hidden md:inline-block text-xl font-bold bg-gradient-to-r from-city-blue-500 to-city-green-500 bg-clip-text text-transparent">
              City Pulse
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                <Link to="/complaints/new">
                  Report Issue
                </Link>
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-complaints">My Complaints</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
