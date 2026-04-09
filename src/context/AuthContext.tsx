import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
  isGoogleUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('tasknova-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('tasknova-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users
      const users = JSON.parse(localStorage.getItem('tasknova-users') || '[]');
      const foundUser = users.find((u: StoredUser) => u.email === email && u.password === password);

      if (foundUser) {
        const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
        setUser(userData);
        localStorage.setItem('tasknova-user', JSON.stringify(userData));
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users
      const users = JSON.parse(localStorage.getItem('tasknova-users') || '[]');

      // Check if user already exists
      if (users.some((u: StoredUser) => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In real app, this would be hashed
        name,
      };

      users.push(newUser);
      localStorage.setItem('tasknova-users', JSON.stringify(users));

      const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
      setUser(userData);
      localStorage.setItem('tasknova-user', JSON.stringify(userData));

      return true;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Decode JWT token from Google
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      const { email, name, sub: id } = decodedToken;

      // Get stored users
      const users = JSON.parse(localStorage.getItem('tasknova-users') || '[]');
      
      // Check if user exists, if not create them
      let foundUser = users.find((u: StoredUser) => u.email === email);
      if (!foundUser) {
        foundUser = {
          id: `google_${id}`,
          email,
          name,
          password: '', // Google users don't have passwords
          isGoogleUser: true,
        };
        users.push(foundUser);
        localStorage.setItem('tasknova-users', JSON.stringify(users));
      }

      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('tasknova-user', JSON.stringify(userData));
      return true;
    } catch {
      console.error('Google login error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tasknova-user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};