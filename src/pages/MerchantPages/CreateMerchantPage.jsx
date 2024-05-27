import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { defaultMerchantLogo } from "../../assets";
import ImageInput from "../../components/Auth/ImageInput";
import { merchantRules } from "../../utils/inputRules";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { postMerchant } from "../../api/merchants";
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

export default function CreateMerchantPage() {
  const { isLogin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === "false") navigate("/login");
  }, [isLogin, navigate]);
  const inputRef = {
    name: useRef(null),
    address: useRef(null),
    phone: useRef(null),
    logo: useRef(null),
  };
  const handleInputOnChange = (attr) => {
    if (attr === "name")
      checkInput(inputRef.name.current, merchantRules.name.regex);
    if (attr === "address")
      checkInput(inputRef.address.current, merchantRules.address.regex);
    if (attr === "phone")
      checkInput(inputRef.phone.current, merchantRules.phone.regex);
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
      address: inputRef.address.current.value.trim(),
      phone: inputRef.phone.current.value.trim(),
      logo: inputRef.logo.current.files[0],
    };

    const checkValid = (form, rules) => {
      // 檢查值是否合法
      let validFalse = false;
      Object.keys(form).forEach((attr) => {
        if (form[attr] && attr !== "logo") {
          // 圖像不檢測
          if (!rules[attr].regex.test(form[attr])) validFalse = true;
        }
      });
      if (validFalse) return false;
      else return true;
    };
    if (checkValid(form, merchantRules) === false) {
      Swal.fire({
        title: "申請失敗!",
        text: "有資料錯誤",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else {
      try {
        const data = await postMerchant(form);
        console.log("送出表單" + data.status, data.apiData);
        if (data.status === "success") {
          Swal.fire({
            title: "申請成功!",
            text: "自動跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/merchants/${data.apiData.id}`),
          });
        } else {
          Swal.fire({
            // 這個是API返回的失敗
            title: "申請失敗",
            text: data.message,
            icon: "error",
            confirmButtonText: "關閉",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "申請失敗!",
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
    navigate(`/home`);
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
        <FormContainer>
          <AuthTitle>申請商家</AuthTitle>
          <h5 className="text-center">上傳商家封面 :</h5>
          <ImageInput
            id="logo"
            defaultImage={defaultMerchantLogo}
            useRef={inputRef.logo}
          />
          <FormInput
            id="name"
            label="商家名稱"
            type="text"
            placeholder="請輸入商家名稱.."
            onChange={() => handleInputOnChange("name")}
            invalidPrompt={merchantRules.name.prompt}
            useRef={inputRef.name}
            minlength={merchantRules.name.min}
            maxlength={merchantRules.name.max}
            isRequired={true}
          />
          <FormInput
            id="phone"
            label="電話(市話或行動)"
            type="phone"
            placeholder="請輸入商家市話或行動電話..."
            onChange={() => handleInputOnChange("phone")}
            invalidPrompt={merchantRules.phone.prompt}
            useRef={inputRef.phone}
            minlength={merchantRules.phone.min}
            maxlength={merchantRules.phone.max}
            isRequired={true}
          />
          <FormInput
            id="address"
            label="地址"
            asTextarea={true}
            placeholder="請輸入商家地址"
            onChange={() => handleInputOnChange("address")}
            invalidPrompt={merchantRules.address.prompt}
            useRef={inputRef.address}
            minlength={merchantRules.address.min}
            maxlength={merchantRules.address.max}
            isRequired={true}
          />

          <Container fluid className="d-flex justify-content-between">
            <StyledAuthButton
              className="btn btn-secondary"
              onClick={(e) => handleCancel(e)}
            >
              取消
            </StyledAuthButton>
            <StyledAuthButton
              className="btn btn-danger"
              onClick={(e) => window.location.reload()}
            >
              清空
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
