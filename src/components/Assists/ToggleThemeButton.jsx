import React from "react";
// import { func, string } from "prop-types";
import styled from "styled-components";

import { MoonIcon, SunIcon } from "../../assets";

import { useThemeContext } from "../../context/ThemeContext";

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useThemeContext();

  const ToggleThemeContainer = styled.button.attrs({
    className: `dark-mode-button  ${theme}`,
  })`
    background: ${({ theme }) => theme.gradient};
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    min-width: 120px;
    max-width: 120px;
    height: 50px;
    padding: 10px 20px;
    border-radius: 25px;
    svg {
      height: auto;
      width: 60px;
      transition: all 0.3s linear;

      // sun icon
      &:first-child {
        transform: ${({ lightTheme }) =>
          lightTheme ? "translate(-10px,0)" : "translateY(100px)"};
      }

      // moon icon
      &:nth-child(2) {
        transform: ${({ lightTheme }) =>
          lightTheme ? "translateY(-100px)" : "translate(10px,0)"};
      }
    }
    @media screen and (max-width: 1400px) {
      min-width: 60px;
      max-width: 90px;
      height: 40px;
      padding: 6px 12px;
      border-radius: 25px;
      svg {
        height: auto;
        width: 45px;
        transition: all 0.3s linear;
      }
    }
  `;

  return (
    <ToggleThemeContainer
      lightTheme={theme === "light"}
      onClick={() => {
        toggleTheme?.();
      }}
    >
      {/*  注意這裡的onClick要用呼叫的 不要用掛載的 */}
      <SunIcon />
      <MoonIcon />
    </ToggleThemeContainer>
  );
}

// ToggleTheme.propTypes = { //檢查用但因為你預設null用不到
//   theme: string.isRequired,
//   toggleTheme: func.isRequired,
// };
