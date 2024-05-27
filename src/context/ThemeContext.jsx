import { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../components/common/theme";
import { ThemeProvider } from "styled-components";

const defaultThemeContext = {
  theme: localStorage.getItem("theme") || "light", // 非必要
  toggleTheme: null,
};

const ThemeContext = createContext(defaultThemeContext); // 注意這裡是上下文物件，需要由這裡提供Provider value
export const useThemeContext = () => useContext(ThemeContext); // 這個取用theme的狀態與設定函式，useTheme會撞名，至於為什麼不用ThemeProvider的useTheme是因為需要取用toggleTheme
export const ThemeContextProvider = ({ children }) => {
  // 注意這是元件，包裝上下文的提供以及狀態，ThemeProvider會撞名
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    // if the theme is not light, then set it to dark
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.setAttribute("data-bs-theme", "dark"); //Bootstrap-React
      setTheme("dark");
      localStorage.setItem("theme", "dark"); // 你的context

      // otherwise, it should be light
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };
  useEffect(() => {
    // 在關閉瀏覽器保留theme，以便重啟網頁及路由更新時取得theme
    const checkTheme = () => {
      const theme = localStorage.getItem("theme");
      if (!theme) localStorage.setItem("theme", "light"); //初次進入網頁設定light
      if (theme === "light") {
        setTheme("light");
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-bs-theme", "light");
      } else if (theme === "dark") {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-bs-theme", "dark");
      }
    };
    checkTheme();
  }, [theme]);
  return (
    <ThemeContext.Provider //  將上下文物件提供為React component 使子元件可以共享上下文
      value={{
        theme,
        toggleTheme,
      }}
    >
      <ThemeProvider // 這個Provider 給包覆層CSS以及styledCSS提供theme變數 注意這是套件元件
        theme={theme === "light" ? lightTheme : darkTheme}
      >
        {" "}
        {/* 將你寫的theme內容丟進去 */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
