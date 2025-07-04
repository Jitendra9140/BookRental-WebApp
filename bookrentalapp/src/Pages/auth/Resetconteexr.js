import React, { createContext, useState } from "react";
export const DataContext = createContext();

const DataContextProvider = (props) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  return (
    <DataContext.Provider value={{ email, setEmail, otp, setOtp }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;