import { createContext } from "react";
import type { User } from "firebase/auth";
import React from "react"; // Required for React.Dispatch type

export interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {}, // Provide an empty function for the default value
});

export default AuthContext;