import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultAvatar } from "../../assets";
import ImageInput from "../../components/Auth/ImageInput";
import { userRules } from "../../utils/inputRules";
import { editUser } from "../../api/user";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import {
  FormContainerStyled,
  StyledAuthButton,
} from "../../components/Auth/FormContainerStyled";
import { BackHomeButton, BackToTopButton, GoBackButton, NavigationToolContainer } from "../../components/Assists/NavigationTool";

export default function EditProfilePage() {
  const { currentMember, isLogin } = useAuth(); // 注意currentMember是異步，可能導致使用者被檢測未登入所以下面掛載loading
  const [getMember, setGetMember] = useState("loading"); // 避免Effect先檢測
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
    name: useRef(null),
    avatar: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    county: useRef(null),
  };
  const handleInputOnChange = (attr) => {
    if (attr === "name")
      checkInput(inputRef.name.current, userRules.name.regex);
    if (attr === "email")
      checkInput(inputRef.email.current, userRules.email.regex);
    if (attr === "phone")
      checkInput(inputRef.phone.current, userRules.phone.regex);
    if (attr === "county")
      checkInput(inputRef.county.current, userRules.county.regex);
  };

  const checkInput = (node, regex) => {
    if (regex.test(node.value)) {
      isValid(node);
      return true;
    } else {
      isInvalid(node);
      return false;
    }
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
      name: inputRef.name.current.value.trim(),
      avatar: inputRef.avatar.current.files[0],
      email: inputRef.email.current.value.trim(),
      phone: inputRef.phone.current.value.trim(),
      county: inputRef.county.current.value.trim(),
    };

    const checkEdit = (form, member) => {
      //如果某個欄位的值沒變 就把他從表單清除不送出
      Object.keys(form).forEach((attr) => {
        console.log(form[attr], member[attr]);
        if (form[attr] === member[attr]) form[attr] = null;
      });
    };
    checkEdit(form, currentMember);
    const checkValid = (form, rules) => {
      // 檢查值是否合法
      let validFalse = false;
      Object.keys(form).forEach((attr) => {
        if (form[attr] && attr !== "avatar") {
          // 圖像不檢測
          if (!rules[attr].regex.test(form[attr])) validFalse = true;
        }
      });
      if (validFalse) return false;
      else return true;
    };
    function hasChange(obj) {
      let change = false;
      Object.keys(obj).forEach((key) => {
        if (obj[key]) change = true;
      });
      return change;
    }
    if (checkValid(form, userRules) === false) {
      Swal.fire({
        title: "修改失敗!",
        text: "有資料錯誤",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else if (!hasChange(form)) {
      Swal.fire({
        title: "未進行修改!",
        text: "資料未變動",
        icon: "info",
        confirmButtonText: "繼續",
      });
      return;
    } else {
      try {
        const data = await editUser({ id: currentMember.id, form });
        console.log("即將送出表單" + data.status, data.apiData);
        // 送出資料後 會收到新的token 要更新payload，網站的header profile等等才會變化
        localStorage.setItem("apiToken", data.apiData.jwtToken);
        if (data.status === "success") {
          Swal.fire({
            title: "修改成功!",
            text: "即將跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/users/${userId}`),
          });
        } else {
          Swal.fire({
            // 這個是API返回的失敗
            title: "註冊失敗",
            text: data.message,
            icon: "error",
            confirmButtonText: "關閉",
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
      <Header/>
      <NavigationToolContainer>
        <BackToTopButton />
        <GoBackButton />
        <BackHomeButton />
      </NavigationToolContainer>
      <FormContainerStyled>
        {/* 注意這邊很容易因為還沒拿到currentMember導致defaultValue失效 */}
        {getMember === "success" && (
          <FormContainer>
            <AuthTitle>編輯個人資料</AuthTitle>
            <ImageInput
              id="avatar"
              defaultImage={currentMember.avatar || defaultAvatar}
              useRef={inputRef.avatar}
              label={"上傳照片"}
            />
            <FormInput
              id="name"
              label="名稱"
              type="text"
              onChange={() => handleInputOnChange("name")}
              invalidPrompt={userRules.name.prompt}
              defaultValue={currentMember.name}
              useRef={inputRef.name}
              minlength={userRules.name.min}
              maxlength={userRules.name.max}
            />
            <FormInput
              id="email"
              label="信箱"
              type="email"
              onChange={() => handleInputOnChange("email")}
              invalidPrompt={userRules.email.prompt}
              defaultValue={currentMember.email}
              useRef={inputRef.email}
              minlength={userRules.email.min}
              maxlength={userRules.email.max}
            />
            <FormInput
              id="phone"
              label="電話"
              type="phone"
              onChange={() => handleInputOnChange("phone")}
              invalidPrompt={userRules.phone.prompt}
              defaultValue={currentMember.phone}
              useRef={inputRef.phone}
              minlength={userRules.phone.min}
              maxlength={userRules.phone.max}
            />
            <FormInput
              id="county"
              label="居住縣市"
              type="county"
              onChange={() => handleInputOnChange("county")}
              invalidPrompt={userRules.county.prompt}
              defaultValue={currentMember.county}
              useRef={inputRef.county}
              minlength={userRules.county.min}
              maxlength={userRules.county.max}
            />
            <Container className="text-center">
              <Link to={`/users/${userId}/editPassword`}>
                <h5 className="btn btn-warning ">我要修改密碼</h5>
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
        )}
      </FormContainerStyled>
    </>
  );
}
