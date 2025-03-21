"use client"

import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserType = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

interface AuthContextProps {
  isAuthenticated: boolean;
  loginUser: () => void;
  loginGoogleCalendar: () => void;
  logoutUser: () => void;
  user: UserType | undefined;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiEndPoint = process.env.NEXT_PUBLIC_BACKEND_API;

  useEffect(() => {
    getCurrentAuth();
  }, []);

  const getCurrentAuth = async (credit: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiEndPoint}/api/auth/google/login_user`, {
        withCredentials: true,
        params: {
          credit: credit ? "true" : null,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    return undefined;
  };

  const loginUser = async () => {
    setIsLoading(true);
    const redirectUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
    window.location.href = `${apiEndPoint}/api/auth/google/profile?redirect=${redirectUrl}`;
  };

  const loginGoogleCalendar = async () => {
    setIsLoading(true);
    const redirectUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    window.location.href = `${apiEndPoint}/api/auth/google/calendar?redirect=${redirectUrl}`;
  };

  const logoutUser = async () => {
    const redirectUrl = encodeURIComponent(process.env.NEXT_PUBLIC_BACKEND_API!);
    window.location.href = `${apiEndPoint}/api/auth/logout?redirect=${redirectUrl}`;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginUser,
        loginGoogleCalendar,
        logoutUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
