import { useContext } from "react";
import authContext from "../Providers/AuthContext";

const useAuth = () => useContext(authContext);

export default useAuth;