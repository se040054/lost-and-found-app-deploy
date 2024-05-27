import { Button } from "react-bootstrap";
import { GrLinkTop } from "react-icons/gr";
import { HiOutlineHome } from "react-icons/hi2";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const NavigationToolContainer = ({ children }) => {
  return <NavigationContainerStyled>{children}</NavigationContainerStyled>;
};

export const BackToTopButton = () => {
  const topFunction = () => {
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
  return (
    <ButtonStyle // 這邊如果套用react-bootstrap 沒有黑暗模式
      className="btn btn-outline-success"
      onClick={() => topFunction?.()}
      title="回到頂端"
    >
      <GrLinkTop />
    </ButtonStyle>
  );
};

export const BackHomeButton = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/home");
  };
  return (
    <ButtonStyle // 這邊如果套用react-bootstrap 沒有黑暗模式
      className="btn btn-outline-success"
      onClick={() => backHome?.()}
      title="回到首頁"
    >
      <HiOutlineHome />
    </ButtonStyle>
  );
};

export const GoBackButton = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <ButtonStyle // 這邊如果套用react-bootstrap 沒有黑暗模式
      className="btn btn-outline-success"
      onClick={() => goBack?.()}
      title="回到上一頁"
    >
      <RiArrowGoBackFill className="align-middle" />
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button`
  z-index: 4;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: 1px solid ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.background};
  padding-top: 2px;
  margin: 10px 0;
  color: #00b11d;
`;

const NavigationContainerStyled = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  bottom: 60px; /* Place the button at the bottom of the page */
  right: 40px; /* Place the button 30px from the right */
  z-index: 3; /* Make sure it does not overlap */
  background-color: transparent; /* Set a background color */
`;
