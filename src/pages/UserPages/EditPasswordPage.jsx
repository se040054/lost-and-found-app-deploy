import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userRules } from "../../utils/inputRules";
import { editPassword } from "../../api/user";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import {
  FormContainerStyled,
  StyledAuthButton,
} from "../../components/Auth/FormContainerStyled";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";

export default function EditPasswordPage() {
  const { currentMember, isLogin } = useAuth();
  const [getMember, setGetMember] = useState("loading"); // 避免Effect先檢測
  const [passwordMatch, setPasswordMatch] = useState(null);
  const userId = useParams().id;
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === "false") navigate("/login");
    if (isLogin === "success") setGetMember("success");
    if (getMember === "success") {
      if (Number(userId) !== Number(currentMember.id)) {
        // 檢測修改對象是否為登入者，注意型別
        navigate(`/users/${currentMember.id}/edit`);
      }
    }
  }, [currentMember, isLogin, userId, getMember, navigate]);
  const inputRef = {
    // input欄位取值+取用節點故使用useRef，並且需要同步密碼與確認密碼並進行同步渲染feedback
    oldPassword: useRef(null),
    newPassword: useRef(null),
    confirmNewPassword: useRef(null),
  };
  const handleInputOnChange = () => {
    // 檢查輸入欄位合法，在檢查密碼是否相同設置state
    if (
      checkInput(inputRef.newPassword.current, userRules.password.regex) &&
      checkInput(
        inputRef.confirmNewPassword.current,
        userRules.password.regex
      ) &&
      inputRef.newPassword.current.value ===
        inputRef.confirmNewPassword.current.value
    ) {
      isValid(inputRef.newPassword.current);
      isValid(inputRef.confirmNewPassword.current);
    } else {
      isInvalid(inputRef.newPassword.current);
      isInvalid(inputRef.confirmNewPassword.current);
    }
    if (
      inputRef.newPassword.current.value ===
      inputRef.confirmNewPassword.current.value
    ) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };
  const checkInput = (node, regex) => regex.test(node.value);

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
      oldPassword: inputRef.oldPassword.current.value.trim(),
      newPassword: inputRef.newPassword.current.value.trim(),
      confirmNewPassword: inputRef.confirmNewPassword.current.value.trim(),
    };

    const checkValid = (form, rules) => {
      // 檢查值是否合法
      let validFalse = false;
      Object.keys(form).forEach((attr) => {
        if (!rules.password.regex.test(form[attr])) validFalse = true;
      });
      if (validFalse) return false;
      else return true;
    };
    if (checkValid(form, userRules) === false) {
      Swal.fire({
        title: "修改失敗!",
        text: "有欄位未填寫完整",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else if (
      // 檢測新舊密碼是否相同，這邊會有一個誤區 : 因為還未檢測舊密碼是否合法就返回此錯誤可能會導致使用者以為舊密碼正確
      form.newPassword.length > 0 &&
      form.oldPassword === form.newPassword
    ) {
      Swal.fire({
        title: "修改失敗!",
        text: "原密碼與新密碼相同",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else {
      try {
        const data = await editPassword({ id: currentMember.id, form });
        if (data.status === "success") {
          Swal.fire({
            title: "重設密碼成功!",
            text: "即將跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/users/${userId}`),
          });
        } else {
          Swal.fire({
            title: "修改失敗!",
            text: data.message,
            confirmButtonText: "繼續",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "修改失敗!",
          text: error.message,
          icon: "error",
          confirmButtonText: "繼續",
        });
        return error;
      }
    }
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/users/${userId}`);
  };
  return (
    <>
      <Header />
      <NavigationToolContainer>
        <BackToTopButton />
        <GoBackButton />
        <BackHomeButton />
      </NavigationToolContainer>
      <FormContainerStyled>
        {/* 注意這邊很容易因為還沒拿到currentMember導致defaultValue失效 */}
        <FormContainer>
          <AuthTitle>重設密碼</AuthTitle>
          <FormInput
            id="oldPassword"
            label="原密碼"
            type="password"
            useRef={inputRef.oldPassword}
            needFeedback={false}
            isRequired={true}
          />
          <FormInput
            id="newPassword"
            label="新密碼"
            type="password"
            useRef={inputRef.newPassword}
            onChange={() => handleInputOnChange()}
            invalidPrompt={userRules.password.prompt}
            invalidPrompt2={!passwordMatch && "密碼不一致 "}
            minlength={userRules.password.min}
            maxlength={userRules.password.max}
            isRequired={true}
          />
          <FormInput
            id="confirmNewPassword"
            label="確認密碼"
            type="password"
            useRef={inputRef.confirmNewPassword}
            onChange={() => handleInputOnChange()}
            invalidPrompt={userRules.password.prompt}
            invalidPrompt2={!passwordMatch && "密碼不一致 "}
            minlength={userRules.password.min}
            maxlength={userRules.password.max}
            isRequired={true}
          />

          <Container className="text-center">
            <Link to={`/users/${userId}/edit`}>
              <h5 className="btn btn-warning ">修改個人資料</h5>
            </Link>
          </Container>
          <Container fluid className="d-flex justify-content-between">
            <StyledAuthButton
              className="btn btn-secondary"
              onClick={(e) => handleCancel(e)}
            >
              取消
            </StyledAuthButton>
            <StyledAuthButton
              className="btn-success"
              onClick={(e) => handleSubmit(e)}
            >
              確認送出
            </StyledAuthButton>
          </Container>
        </FormContainer>
      </FormContainerStyled>
    </>
  );
}
