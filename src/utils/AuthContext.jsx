import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log("error in getUserOnLoad::", error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try {
      let response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
      toast.success("Login Successfull");
      navigate("/");
    } catch (error) {
      toast.error(`${error}`);
      console.error("error in handleUserLogin::", error);
    }
  };

  const handleLogout = async () => {
    const response = await account.deleteSession("current");
    toast.success("Logout Successfull");
    setUser(null);
  };

  const handleRegister = async (e, credentials) => {
    e.preventDefault();

    if (credentials.password !== credentials.comfirmpassword) {
      toast.error("Passwords did not match");
      return;
    }

    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password,
        credentials.name
      );
      //console.log("User registered!", response);

      await account.createEmailSession(credentials.email, credentials.password);
      let accountDetails = await account.get();
      setUser(accountDetails);
      toast.success("Registration Successfull");
      navigate("/");
    } catch (error) {
      toast.error("user with the same email already exists");
      console.error(error);
    }
  };
  const contextData = { user, handleUserLogin, handleLogout, handleRegister };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
