import styled from "styled-components";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { decodeJwt } from "jose";
import axios from "axios";
import { apiGoogleLogin } from "../../api/oauth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function GoogleOAuthButton() {
  const navigate = useNavigate();
  const apiLogin = async ({ name, email, avatar }) => {
    try {
      const data = await apiGoogleLogin({
        email,
        name,
        avatar: avatar || null,
      });
      if (data.status === "success") {
        console.log(data.apiData);
        localStorage.setItem("apiToken", data.apiData.token);
        Swal.fire({
          title: "Google登入成功!",
          text: "即將跳轉至首頁",
          icon: "success",
          timer: 6000,
          confirmButtonText: "進入首頁",
          willClose: () => navigate("/home"),
        });
      } else {
        Swal.fire({
          title: "Google登入失敗",
          text: data.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Google登入失敗",
        text: error.message,
        icon: "error",
      });
    }
  };
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      await apiLogin({
        email: userInfo.data.email,
        name: userInfo.data.name,
        avatar: userInfo.data.picture,
      });
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <GoogleButton
      onClick={() => {
        login();
      }}
    >
      <ButtonState className="gsi-material-button-state" />
      <ButtonContentWrapper className="gsi-material-button-content-wrapper">
        <ButtonIcon className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </ButtonIcon>
        <ButtonContents className="gsi-material-button-contents">
          Sign in with Google
        </ButtonContents>
        <span style={{ display: "none" }}>使用Google繼續</span>
      </ButtonContentWrapper>
    </GoogleButton>
  );
}

const GoogleButton = styled.button`
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-appearance: none;
  background-color: ${(props) => props.theme.background};
  background-image: none;
  border: 1px solid #747775;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: center;
  -webkit-transition: background-color 0.218s, border-color 0.218s,
    box-shadow 0.218s;
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  vertical-align: middle;
  white-space: nowrap;
  width: 300px;
  max-width: 300px;
  min-width: min-content;
  border-radius: 5px;
  min-width: 300px;
  height: 40px;
  padding: 0 24px;
  margin-bottom: 1.2rem 0;
  &:disabled {
    cursor: default;
    background-color: #ffffff61;
    border-color: #1f1f1f1f;
  }

  &:disabled .gsi-material-button-contents,
  &:disabled .gsi-material-button-icon {
    opacity: 38%;
  }

  &:not(:disabled):active .gsi-material-button-state,
  &:not(:disabled):focus .gsi-material-button-state {
    background-color: #303030;
    opacity: 12%;
  }

  &:not(:disabled):hover {
    -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 1px 3px 1px rgba(60, 64, 67, 0.15);
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 1px 3px 1px rgba(60, 64, 67, 0.15);
  }

  &:not(:disabled):hover .gsi-material-button-state {
    background-color: #303030;
    opacity: 8%;
  }
`;

const ButtonState = styled.div`
  -webkit-transition: opacity 0.218s;
  transition: opacity 0.218s;
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const ButtonContentWrapper = styled.div`
  -webkit-align-items: center;
  align-items: center;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: space-between;
  position: relative;
  width: 100%;
`;

const ButtonIcon = styled.div`
  height: 20px;
  min-width: 20px;
  width: 20px;
`;

const ButtonContents = styled.span`
  -webkit-flex-grow: 1;
  flex-grow: 1;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
`;
