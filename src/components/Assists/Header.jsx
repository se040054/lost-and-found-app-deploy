import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToggleThemeButton from "./ToggleThemeButton";
import Navbar from "react-bootstrap/Navbar";
import Swal from "sweetalert2";
import { Container, Image, Nav } from "react-bootstrap";
import { defaultAvatar, webLogo } from "../../assets";
export default function Header() {
  const { isLogin, logout, currentMember } = useAuth();
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

  return (
    <NavBarStyled fixed="top">
      {/* 左邊資訊個人欄位 */}
      <Container className="justify-content-start">
        {/* fluid 消除container自帶的300margin */}
        {/* 左側 Nav A */}
        <Nav>
          <BrandStyled href="/home">
            <Logo />
          </BrandStyled>
          <BrandStyled href="/home">Lost & Found</BrandStyled>
          {currentMember && (
            <>
              <UserStyled href={`/users/${currentMember.id}`}>
                <Image
                  alt="avatar"
                  id="avatar-preview"
                  className="ms-3  rounded-circle"
                  src={currentMember.avatar || defaultAvatar}
                  roundedCircle
                  style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "center",
                  }}
                />
              </UserStyled>
              <UserStyled href={`/users/${currentMember.id}`}>
                {currentMember.name}
              </UserStyled>
            </>
          )}
        </Nav>
      </Container>
      {/* 中間 連結 */}{" "}
      <Container className="justify-content-center">
        <Nav>
          <LinkStyled to="/home">回到首頁</LinkStyled>
          <LinkStyled
            to={currentMember ? `/users/${currentMember.id}` : "/login"}
          >
            個人檔案
          </LinkStyled>
          <LinkStyled to={currentMember ? `/claims/submitted` : "/login"}>
            我的認領
          </LinkStyled>
        </Nav>
      </Container>
      {/* 右邊 登出 輔助 */}
      <Container className="justify-content-end">
        <Nav>
          <ToggleThemeButton />
          {isLogin === "success" ? (
            <button className="btn" onClick={() => handleLogout()}>
              登出
            </button>
          ) : (
            <>
              <LinkStyled to="/register">註冊</LinkStyled>
              <LinkStyled to="/login">登入</LinkStyled>
            </>
          )}
        </Nav>
      </Container>
    </NavBarStyled>
  );
}

const NavBarStyled = styled(Navbar)`
  background-color: ${(props) => props.theme.headerBackground};
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
`;

const BrandStyled = styled(Navbar.Brand)`
  display: flex;
  align-items: center;
  width: 100%;
  vertical-align: middle;
  font-size: 1.4rem;
`;

const UserStyled = styled(Navbar.Brand)`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  content: url(${webLogo});
`;

const LinkStyled = styled(Link)`
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 25px;
  font-weight: bold;
  &:hover {
    color: ${(props) => props.theme.hoverText};
    background-color: #f2fffaa2;
  }
`;
