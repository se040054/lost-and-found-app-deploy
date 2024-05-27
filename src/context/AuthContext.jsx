import { createContext, useContext, useEffect, useState } from "react";
import { authToken, login, register } from "../api/user";
import * as jose from "jose";
import { useLocation } from "react-router-dom";

const defaultAuthContext = {
  isLogin: null,
  currentMember: null,
  login: null,
  register: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext); // 注意這裡是上下文提供本身

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => { // 這邊是元件，包裝你的上下文
  const [isLogin, setIsLogin] = useState("loading");
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();
  const registerProvider = async (form) => {
    try {
      const data = await register(form);
      return data; // 不用管成功失敗 前面抓過異常了
    } catch (error) {
      return error;
    }
  };
  const loginProvider = async (form) => {
    try {
      const data = await login(form);
      if (data.status === "success") {
        const tempPayload = jose.decodeJwt(data.apiData.jwtToken);
        if (tempPayload) {
          setIsLogin("success");
          setPayload(tempPayload);
          localStorage.setItem("apiToken", data.apiData.jwtToken);
        } else {
          setIsLogin("false");
          setPayload(null);
        }
      }
      return data; // 不用管成功失敗 前面抓過異常了
    } catch (error) {
      console.log(error);
      setIsLogin("false");
      setPayload(null);
      return error;
    }
  };

  const logoutProvider = () => {
    localStorage.removeItem("apiToken");
    setIsLogin("false");
    setPayload(null);
  };
  useEffect(() => {
    // 再使用者重啟頁面，更換路由時先檢查token之後更新登入狀態(isLogin)及登入資料(currentMember)
    async function authLogin() {
      const pendingToken = localStorage.getItem("apiToken");
      if (!pendingToken) {
        console.log("效果檢測 : 無token");
        setPayload(null); // 清空登入資料
        setIsLogin("false"); // 未驗證
        return;
      }
      try {
        const data = await authToken(pendingToken);
        if (data.status === "success") {
          const nextPayload = jose.decodeJwt(pendingToken);
          setPayload(nextPayload);
          setIsLogin("success");
          console.log("效果檢測 : 已設置token");
        } else {
          setPayload(null); // 清空登入資料
          setIsLogin("false"); // 明確的返回登入失敗 而不是null(未驗證)
          console.log("效果檢測 : 未設置token");
        }
      } catch (error) {
        setPayload(null); // 清空登入資料
        setIsLogin("false"); // 明確的返回登入失敗 而不是null(未驗證)

        console.log("效果檢測 : 未設置token");
        return error;
      }
    }
    authLogin();
  }, [pathname]); // 掛載更換路由及進入網頁時驗證
  return (
    <AuthContext.Provider
      value={{
        isLogin: isLogin,
        currentMember: payload,
        login: loginProvider,
        register: registerProvider,
        logout: logoutProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
