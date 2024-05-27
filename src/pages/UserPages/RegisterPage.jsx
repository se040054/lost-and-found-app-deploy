import {
  AuthPage,
  AuthContainer,
  AuthTitle,
  AuthBanner,
  AuthButton,
  AuthLink,
  AuthMainContainer,
  AuthBannerConatiner,
  AuthBannerContainer,
} from "../../components/Auth/AuthPageStyled";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { Link, useNavigate } from "react-router-dom";
import ToggleThemeButton from "../../components/Assists/ToggleThemeButton";
import GoogleOAuthButton from "../../components/OAuth/GoogleOAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const inputRef = {
    // input欄位取值+取用節點故使用useRef，並且需要同步密碼與確認密碼並進行同步渲染feedback
    account: useRef(""),
    password: useRef(""),
    confirmPassword: useRef(""),
    name: useRef(""),
  };
  const { register, isLogin } = useAuth();
  if (isLogin === "success") {
    navigate("/home");
  }
  const [passwordMatch, setPasswordMatch] = useState(null);
  const handleInputOnChange = (attr) => {
    if (attr === "account") checkAccount(inputRef.account.current);
    if (attr === "name") checkName(inputRef.name.current);
    if (attr === "password" || attr === "confirmPassword")
      checkPasswords(
        inputRef.password.current,
        inputRef.confirmPassword.current
      );
  };
  const checkAccount = (node) => {
    if (node.value.length >= 3) isValid(node);
    else isInvalid(node);
  };
  const checkName = (node) => {
    if (node.value.length >= 2) isValid(node);
    else isInvalid(node);
  };
  const checkPasswords = (passwordNode, confirmPasswordNode) => {
    if (
      passwordNode.value === confirmPasswordNode.value &&
      passwordNode.value.length >= 3
    ) {
      isValid(passwordNode);
      isValid(confirmPasswordNode);
    } else {
      isInvalid(passwordNode);
      isInvalid(confirmPasswordNode);
    }
    if (passwordNode.value === confirmPasswordNode.value)
      setPasswordMatch(true);
    else setPasswordMatch(false);
  };

  const isValid = (node) => {
    node.classList.remove("is-invalid");
    node.classList.add("is-valid");
  };
  const isInvalid = (node) => {
    node.classList.remove("is-valid");
    node.classList.add("is-invalid");
  };
  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const form = {
      account: inputRef.account.current.value,
      password: inputRef.password.current.value,
      confirmPassword: inputRef.confirmPassword.current.value,
      name: inputRef.name.current.value,
    };
    if (
      form.name.length < 2 ||
      form.account.length < 3 ||
      form.password.length < 3 ||
      form.confirmPassword.length < 3 ||
      form.password !== form.confirmPassword
    ) {
      Swal.fire({
        title: "表單資訊不完整",
        text: "欄位未填寫完整",
        icon: "question",
      });
      return;
    }

    try {
      const data = await register(form);
      console.log(data);
      if (data.status === "success") {
        Swal.fire({
          title: "註冊成功!",
          text: "馬上登入",
          icon: "success",
          timer: 3000,
          confirmButtonText: "登入",
          willClose: () => navigate("/login"),
        });
      } else {
        Swal.fire({
          // 這個是API返回的失敗
          title: "註冊失敗",
          text: data.message,
          icon: "error",
          confirmButtonText: "關閉",
        });
        // 因為Provider已經捕捉過異常了 這個資料還是會打進來
        document.querySelector("#account-feedback-invalid").innerText =
          "帳號已被註冊";
        isInvalid(inputRef.account.current);
      }
    } catch (error) {
      // 這個是API或AuthProvider異常的失敗 通常不會進來
      Swal.fire({
        title: "註冊失敗!",
        text: error.message,
        icon: "error",
        confirmButtonText: "繼續",
      });
    }
  };
  return (
    <AuthPage>
      <AuthMainContainer>
        <AuthContainer>
          <ToggleThemeButton />
          <FormContainer>
            <AuthTitle>建立您的免費帳戶</AuthTitle>
            <FormInput
              id="account"
              label="帳號"
              type="text"
              placeholder="請輸入帳號"
              onChange={() => handleInputOnChange("account")}
              useRef={inputRef.account}
              invalidPrompt={"至少包含 3 個以上字元"}
              minlength={3}
              maxlength={16}
              isRequired={true}
            />
            <FormInput
              id="password"
              label="密碼"
              type="password"
              placeholder="請輸入密碼"
              onChange={() => handleInputOnChange("password")}
              useRef={inputRef.password}
              invalidPrompt={
                !passwordMatch ? "密碼不一致" : "至少包含3個以上字元"
              }
              minlength={3}
              maxlength={16}
              isRequired={true}
            />
            <FormInput
              id="confirmPassword"
              label="確認密碼"
              type="password"
              placeholder="請輸入確認密碼"
              onChange={() => handleInputOnChange("confirmPassword")}
              useRef={inputRef.confirmPassword}
              invalidPrompt={
                !passwordMatch ? "密碼不一致" : "至少包含3個以上字元"
              }
              minlength={3}
              maxlength={16}
              isRequired={true}
            />
            <FormInput
              id="name"
              label="用戶名稱"
              type="text"
              placeholder="請輸入用戶名稱"
              onChange={() => handleInputOnChange("name")}
              useRef={inputRef.name}
              invalidPrompt={"至少包含 2 個以上字元"}
              minlength={2}
              maxlength={16}
              isRequired={true}
            />
            <AuthButton
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              註冊
            </AuthButton>
          </FormContainer>
          <GoogleOAuthButton />
          <Link to="/home">
            <AuthButton>晚點再說，進入網站</AuthButton>
          </Link>
          <AuthLink>
            已經有帳號了？　{"  "}
            <Link to="/login">登入</Link>
          </AuthLink>
        </AuthContainer>
      </AuthMainContainer>
      <AuthBannerContainer>
        <AuthBanner />
      </AuthBannerContainer>
    </AuthPage>
  );
}
