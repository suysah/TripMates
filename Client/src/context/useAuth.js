import { createContext, useContext } from "react";
// import { AuthContext } from "./AuthContext";

export const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

export default useAuth;
