import React, { createContext, useContext,useState } from "react";
export const DataContext = createContext();
const DataContextProvider = (props) => {
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [userd, setuserd] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [userid,setUserid]=useState();
  const [bookdel,setbookdel]=useState([])
  return (
    <DataContext.Provider value={{ email, setEmail,otp, setOtp,userd, setuserd ,userid,setUserid,bookdel,setbookdel}}>
      {props.children}
    </DataContext.Provider>
  );
};
export default DataContextProvider;