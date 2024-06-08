import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToggleThemeButton from "./ToggleThemeButton";
import Navbar from "react-bootstrap/Navbar";
import Swal from "sweetalert2";
import {
  Button,
  Col,
  Collapse,
  Container,
  Image,
  Nav,
  Row,
} from "react-bootstrap";
import { defaultAvatar } from "../../assets";
import { ReactComponent as WebLogo } from "../../assets/images/lost-and-found.svg";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
export default function Header() {
  const { isLogin, logout, currentMember } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "確定要登出嗎?",
      showCancelButton: true,
      confirmButtonText: "登出",
      confirmButtonColor: "#3B8C66",
      cancelButtonText: `取消`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("已登出!", "", "success");
        navigate("/home");
      }
    });
  };

  function CollapseMenu() {
    return (
      <>
        <CollapseItemStyled to="/home">回到首頁</CollapseItemStyled>
        <CollapseItemStyled
          to={currentMember ? `/users/${currentMember.id}` : "/login"}
        >
          個人檔案
        </CollapseItemStyled>
        <CollapseItemStyled to={currentMember ? `/claims/submitted` : "/login"}>
          我的認領
        </CollapseItemStyled>
        {isLogin === "success" ? (
          <>
            <CollapseItemStyled onClick={() => handleLogout()}>
              登出
            </CollapseItemStyled>
          </>
        ) : (
          <>
            <CollapseItemStyled to="/register">註冊</CollapseItemStyled>
            <CollapseItemStyled to="/login">登入</CollapseItemStyled>
          </>
        )}
      </>
    );
  }
  return (
    <NavBarStyled fluid fixed="top">
      {/* 左邊資訊個人欄位 */}
      <Row className="w-100 p-0 m-0">
        {/* Logo */}
        <ColStyled xs={5} sm={4} md={3} lg={2} xl={2} xxl={2}>
          <LeftContainer>
            <Link to="/home">
              <Container className="d-flex align-items-center">
                <Logo />
                <LogoTextStyled>Lost & Found</LogoTextStyled>
              </Container>
            </Link>
          </LeftContainer>
        </ColStyled>
        {/* 使用者資訊 */}
        <ColStyled className="d-none d-lg-flex" lg={1} xl={2} xxl={2}>
          {currentMember && (
            <>
              <Link to={`/users/${currentMember.id}`} className="d-flex ms-2">
                <UserImageStyled
                  alt="avatar"
                  id="avatar-preview"
                  src={currentMember.avatar || defaultAvatar}
                />
                <UserNameStyled>{currentMember.name}</UserNameStyled>
              </Link>
            </>
          )}
        </ColStyled>
        {/* 連結欄 */}
        <ColStyled className="d-none d-md-flex" md={5} lg={5} xl={4} xxl={4}>
          {/* xl-0 並不會讓Col隱藏 */}
          <CenterContainer>
            <ActionStyled to="/home">回到首頁</ActionStyled>
            <ActionStyled
              to={currentMember ? `/users/${currentMember.id}` : "/login"}
            >
              個人檔案
            </ActionStyled>
            <ActionStyled to={currentMember ? `/claims/submitted` : "/login"}>
              我的認領
            </ActionStyled>{" "}
          </CenterContainer>
        </ColStyled>

        {/*漢堡排 */}
        <ColStyled className="d-md-none" xs={2} sm={4}>
          <CollapseContainerStyled>
            {" "}
            <GiHamburgerMenu onClick={() => setOpen(!open)} />
          </CollapseContainerStyled>
        </ColStyled>

        {/* 主題按鈕 */}
        <ColStyled
          xs={5}
          sm={4}
          md={2}
          lg={2}
          xl={2}
          xxl={{ span: 1, offset: 1 }}
        >
          <ToggleThemeContainer>
            <ToggleThemeButton />
          </ToggleThemeContainer>
        </ColStyled>
        {/* 帳戶功能 */}
        <ColStyled className="d-none d-md-flex" md={2} lg={2} xl={2} xxl={2}>
          <RightContainer>
            {isLogin === "success" ? (
              <>
                <AccountServiceStyled onClick={() => handleLogout()}>
                  登出
                </AccountServiceStyled>
              </>
            ) : (
              <>
                <ActionStyled to="/register">註冊</ActionStyled>
                <ActionStyled to="/login">登入</ActionStyled>
              </>
            )}
          </RightContainer>
        </ColStyled>

        <Row className="w-100 m-0 p-0">
          {/* 這裡沒有在open 的時候就不會顯示 */}
          <Collapse in={open}>
            <Col>
              <CollapseMenu />
            </Col>
          </Collapse>
        </Row>
      </Row>
    </NavBarStyled>
  );
}

const ColStyled = styled(Col)`
  display: flex;
  align-items: center;
  @media screen and (max-width: 991px) {
    margin: 0;
    padding: 0;
    font-size: 1rem;
  }
`;

const LeftContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const CenterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleThemeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const NavBarStyled = styled(Navbar)`
  width: 100%;
  background-color: ${(props) => props.theme.headerBackground};
`;

const BrandTextBaseStyled = styled(Navbar.Brand)`
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 1.2rem;
  cursor: pointer;
  @media screen and (max-width: 1400px) {
    font-size: 1rem;
    margin:0;
    padding:0;
}
`;

const LogoTextStyled = styled(BrandTextBaseStyled)`
  font-size: 0.8rem;
  font-weight: bold;
`;

const Logo = styled(WebLogo)`
  font-size: 2rem;
`;

const UserImageStyled = styled(Image)`
  margin: 0 5px 0 40px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: center;
  @media screen and (max-width: 991px) {
    display: none;
  }
`;
const UserNameStyled = styled(BrandTextBaseStyled)`
  font-weight: normal;
  font-size: 0.9rem;
  @media screen and (max-width: 1399px) {
    display: none;
  }
`;

const ActionStyled = styled(Link)`
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  &:hover {
    color: ${(props) => props.theme.hoverText};
    background-color: #f2fffaa2;
  }
  @media screen and (max-width: 1400px) {
    font-size: 1rem;
    padding: 6px 10px;
  }
`;

const AccountServiceStyled = styled(BrandTextBaseStyled)`
  justify-content: end;
  width: auto;
  /* 記得不要占滿 不然空白處會被點擊 */
  padding: 10px 20px;
  font-size: 1rem;
  @media screen and (max-width: 1400px) {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
`;

const CollapseContainerStyled = styled.div`
  background-color: ${(props) => props.theme.headerBackground};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
`;

const CollapseItemStyled = styled(Link)`
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 1.2rem;
  padding: 10px 20px;
  font-weight: bold;
  border-top: 1px solid ${(props) => props.theme.border};
`;
