
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define user type
export interface User {
  id: string;
  name: string;
  phone: string;
  aadharVerified: boolean;
  location: {
    city: string;
    area: string;
    pincode: string;
  };
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (phone: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempPhone, setTempPhone] = useState('');

  // Mock user data
  const mockUser: User = {
    id: '123456',
    name: 'Rahul Sharma',
    phone: '9876543210',
    aadharVerified: true,
    location: {
      city: 'Bangalore',
      area: 'Indiranagar',
      pincode: '560038'
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('city-pulse-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Send OTP to phone number
  const sendOtp = async (phone: string): Promise<boolean> => {
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setTempPhone(phone);
    
    // Mock success
    return true;
  };

  // Verify OTP (mock implementation)
  const verifyOtp = async (otp: string): Promise<boolean> => {
    // Mock OTP verification
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    // For demo purposes, any 6-digit OTP is valid
    return otp.length === 6;
  };

  // Login function
  const login = async (phone: string, otp: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, authentication is always successful
    const authed = true;
    
    if (authed) {
      // Set user
      setUser(mockUser);
      localStorage.setItem('city-pulse-user', JSON.stringify(mockUser));
    }
    
    setLoading(false);
    return authed;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('city-pulse-user');
  };

  // Provide the context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyOtp,
        logout,
        sendOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
