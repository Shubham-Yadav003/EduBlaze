import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main.jsx";
import toast, { Toaster } from "react-hot-toast";
const UserContext = createContext();

export const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState([]); // user state to store user data
  const [isAuth, setIsAuth] = useState(false); // isAuthenticated state to check if user is authenticated
  const [btnLoading, setBtnLoading] = useState(false); // button loading state to show loading spinner on button click
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate,fetchMyCourse) {
    setBtnLoading(true); // set button loading to true
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password }) // email, password will be passed as prop

      console.log("data", data);
      toast.success(data.message);
      localStorage.setItem("token", data.token); // set token in local storage
      setUser(data.user); // set user data in state
      setIsAuth(true); // set isAuthenticated to true
      setBtnLoading(false); // set button loading to false
      navigate("/"); // navigate to home page
      fetchMyCourse(); // fetch my courses after login
    } catch (error) {
      console.log("error", error);

      setBtnLoading(false); // set button loading to false
      setIsAuth(false); // set isAuthenticated to false
      toast.error(error.response.data.message); // show error message
      // console.log(error);
    }
  }



  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true); // set button loading to true
    try {
      const { data } = await axios.post(`${server}/api/user/register`, 
        { name, 
          email, 
          password }) // email, password will be passed as prop

      console.log("data", data);
     
      localStorage.setItem("activationToken", data.activationToken); // set token in local storage
      toast.success(data.message);
      setBtnLoading(false); // set button loading to false
      navigate("/verify"); // navigate to verify page
    } catch (error) {
      console.log("error", error);

      setBtnLoading(false); // set button loading to false
      toast.error(error.response.data.message); // show error message
      // console.log(error);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true); // Start loading
    // const activationToken = localStorage.getItem("activationToken")
    try {
      const activationToken = localStorage.getItem("activationToken");
      if (!activationToken) {
        throw new Error("Activation token not found");
      }

      const { data } = await axios.post(`${server}/api/user/verify`,
        { otp, activationToken })

      toast.success(data.message);
      setBtnLoading(false);
      navigate("/login");
      localStorage.removeItem("activationToken");

    } catch (error) {
      toast.error(error.response.data.message); // show error message

    }
    finally {
      setBtnLoading(false); // Ensure loading state is always reset
    }
  }


  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token") // get token from local storage
        }
      });

      setIsAuth(true); // set isAuthenticated to true
      setUser(data.user); // set user data in state
      setLoading(false); // set loading to false, {if user is found}
    } catch (error) {
      console.log("error", error);
      setLoading(false); // set loading to false, {if user is not found}


    }
  }

  useEffect(() => {
    fetchUser(); // fetch user data on component mount
  }, [])

  return <UserContext.Provider value={{
    user, setUser, isAuth, setIsAuth,
    btnLoading, loginUser, loading,
    registerUser, verifyOtp, fetchUser
  }}>
    {children}
    <Toaster />
  </UserContext.Provider>
}

export const UserData = () => useContext(UserContext);