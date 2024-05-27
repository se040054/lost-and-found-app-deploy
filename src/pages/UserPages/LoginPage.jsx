import {
  AuthPage,
  AuthMainContainer,
  AuthContainer,
  AuthTitle,
  AuthBanner,
  AuthButton,
  AuthLink,
  AuthBannerConatiner,
  AuthBannerContainer,
} from "../../components/Auth/AuthPageStyled";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { Link, useNavigate } from "react-router-dom";
import ToggleThemeButton from "../../components/Assists/ToggleThemeButton";
import GoogleOAuthButton from "../../components/OAuth/GoogleOAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const defaultForm = {
    account: "",
    password: "",
  };
  const [form, setForm] = useState(defaultForm); // 不需要節點 所以只需用state
  const { login, isLogin } = useAuth();
   if (isLogin === "success") {
     navigate("/home");
   }
  const handleInputOnChange = (attr, inputValue) => {
    setForm({ ...form, [attr]: inputValue });
  };
 
  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(form);
    if (form.account.length < 3 || form.password.length < 3) {
      Swal.fire({
        title: "帳號或密碼太短了",
        text: "欄位未填寫完整",
        icon: "question",
      });
      return;
    }
    try {
      const data = await login(form);

      if (data.status === "success") {
        Swal.fire({
          title: "登入成功!",
          text: "即將跳轉至首頁",
          icon: "success",
          timer: 3000,
          confirmButtonText: "進入首頁",
          willClose: () => navigate("/home"),
        });
      } else {
        // 這是API返回的錯誤，因為Provider捕捉過錯誤了 這裡只會是返回資料
        Swal.fire({
          title: "登入失敗!",
          text: data.message,
          icon: "error",
          confirmButtonText: "繼續",
        });
      }
    } catch (error) {
      // 通常不會進來這裡，例外異常
      Swal.fire({
        title: "登入失敗!",
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
            <AuthTitle>登入</AuthTitle>
            <FormInput
              id="account"
              label="帳號"
              type="text"
              placeholder="請輸入帳號"
              onChange={(e) => handleInputOnChange("account", e.target.value)}
              needFeedback={false}
              isRequired={true}
            />
            <FormInput
              id="password"
              label="密碼"
              type="password"
              placeholder="請輸入密碼"
              onChange={(e) => handleInputOnChange("password", e.target.value)}
              needFeedback={false}
              isRequired={true}
            />

            <AuthButton
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              登入
            </AuthButton>
          </FormContainer>
          <GoogleOAuthButton />
          <Link to="/home">
            <AuthButton>晚點再說，進入網站</AuthButton>
          </Link>
          <AuthLink>
            還沒有帳號？　{"  "}
            <Link to="/register"> 註冊</Link>
          </AuthLink>
        </AuthContainer>
      </AuthMainContainer>
      <AuthBannerContainer>
        <AuthBanner />
      </AuthBannerContainer>
    </AuthPage>
  );
}
