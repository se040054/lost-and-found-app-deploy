import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { defaultMerchantLogo } from "../../assets";
import ImageInput from "../../components/Auth/ImageInput";
import { merchantRules } from "../../utils/inputRules";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { editMerchant, getMerchant } from "../../api/merchants";
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

export default function EditMerchantPage() {
  const { currentMember, isLogin } = useAuth(); // 注意currentMember是異步，可能導致使用者被檢測未登入所以下面掛載loading
  const [apiRes, setApiRes] = useState("loading"); // 避免Effect先檢測
  const [merchant, setMerchant] = useState(null);
  const merchantId = useParams().id;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMerchant = async () => {
      if (isLogin === "false") navigate("/login");
      try {
        const data = await getMerchant(merchantId);
        if (!data.apiData) {
          setMerchant(null);
          setApiRes("false");
          return;
        }
        if (isLogin === "success" && data.apiData.userId !== currentMember.id) {
          Swal.fire({
            title: "權限不足!",
            text: "不能修改別人的商家",
            icon: "error",
            confirmButtonText: "繼續",
            willClose: () => navigate("/home"),
          });
        }
        setMerchant(data.apiData);
        setApiRes("success"); //加載完商家資料
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchMerchant();
  }, [merchantId, isLogin, navigate, currentMember?.id]);

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
    const checkEdit = (form, merchant) => {
      //如果某個欄位的值沒變 就把他從表單清除不送出
      Object.keys(form).forEach((attr) => {
        console.log(form[attr], merchant[attr]);
        if (form[attr] === merchant[attr]) form[attr] = null;
      });
    };
    checkEdit(form, merchant);
    const checkValid = (form, rules) => {
      // 檢查值是否合法
      let validFalse = false;
      Object.keys(form).forEach((attr) => {
        if (form[attr] && attr !== "logo") {
          // 圖像不檢測 (在元件本身就檢測過了)
          if (!rules[attr].regex.test(form[attr])) validFalse = true;
        }
      });
      if (validFalse) return false;
      else return true;
    };
    function hasChange(obj) {
      // 檢查是否整張表單都與修改前相同
      let change = false;
      Object.keys(obj).forEach((key) => {
        if (obj[key]) change = true;
      });
      return change;
    }
    if (checkValid(form, merchantRules) === false) {
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
        console.log("即將送出表單" + JSON.stringify(form));
        const data = await editMerchant({ id: merchantId, form });
        console.log(data);
        if (data.status === "success") {
          Swal.fire({
            title: "修改成功!",
            text: "即將跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/merchants/${merchantId}`),
          });
        } else {
          Swal.fire({
            // 這個是API返回的失敗
            title: "申請商家失敗",
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
    navigate(`/merchants/${merchantId}`);
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
        {apiRes === "success" && (
          <FormContainer>
            <AuthTitle>編輯商家資料</AuthTitle>
            <ImageInput
              id="logo"
              defaultImage={merchant.logo || defaultMerchantLogo}
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
              defaultValue={merchant.name}
              minlength={merchantRules.name.min}
              maxlength={merchantRules.name.max}
            />
            <FormInput
              id="phone"
              label="電話(市話或行動)"
              type="phone"
              placeholder="請輸入商家市話或行動電話..."
              onChange={() => handleInputOnChange("phone")}
              invalidPrompt={merchantRules.phone.prompt}
              useRef={inputRef.phone}
              defaultValue={merchant.phone}
              minlength={merchantRules.phone.min}
              maxlength={merchantRules.phone.max}
            />
            <FormInput
              id="address"
              label="地址"
              asTextarea={true}
              placeholder="請輸入商家地址"
              onChange={() => handleInputOnChange("address")}
              invalidPrompt={merchantRules.address.prompt}
              useRef={inputRef.address}
              defaultValue={merchant.address}
              minlength={merchantRules.address.min}
              maxlength={merchantRules.address.max}
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
        )}
      </FormContainerStyled>
    </>
  );
}
