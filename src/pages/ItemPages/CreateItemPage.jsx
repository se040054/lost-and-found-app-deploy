import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { defaultItemPhoto, defaultMerchantLogo } from "../../assets";
import ImageInput from "../../components/Auth/ImageInput";
import { itemRules } from "../../utils/inputRules";
import Swal from "sweetalert2";
import { Container, Spinner } from "react-bootstrap";
import {
  FormContainerStyled,
  StyledAuthButton,
} from "../../components/Auth/FormContainerStyled";
import { getUser } from "../../api/user";
import { getCategories } from "../../api/categories";
import SelectInput from "../../components/Auth/SelectInput";
import DateInput from "../../components/Auth/DateInput";
import { postItem } from "../../api/items";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";

export default function CreateItemPage() {
  const { isLogin, currentMember } = useAuth();
  const [apiRes, setApiRes] = useState();
  const [merchants, setMerchants] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === "false") navigate("/login");
    if (isLogin === "success") {
      const fetchData = async () => {
        try {
          const MerchantsData = await getUser(currentMember.id);
          setMerchants(MerchantsData.apiData.Merchants);
          const CategoriesData = await getCategories();
          setCategories(CategoriesData.apiData);
          console.log("商家" + JSON.stringify(MerchantsData.apiData.Merchants));
          console.log("分類" + JSON.stringify(CategoriesData.apiData));
          setApiRes("success");
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [isLogin, navigate, apiRes, currentMember?.id]);
  const inputRef = {
    name: useRef(null),
    description: useRef(null),
    place: useRef(null),
    findDate: useRef(null),
    photo: useRef(null),
    categoryId: useRef(null),
    merchantId: useRef(null),
  };
  const handleInputOnChange = (attr) => {
    if (attr === "name")
      checkInput(inputRef.name.current, itemRules.name.regex);
    if (attr === "description")
      checkInput(inputRef.description.current, itemRules.description.regex);
    if (attr === "place")
      checkInput(inputRef.place.current, itemRules.place.regex);
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
      description: inputRef.description.current.value.trim(),
      place: inputRef.place.current.value.trim(),
      findDate: inputRef.findDate.current.value.trim(),
      photo: inputRef.photo.current.files[0],
      categoryId: inputRef.categoryId.current.value.trim(),
      merchantId: inputRef.merchantId.current.value.trim(),
    };

    const checkInValid = (form, rules) => {
      // 檢查值比較少且特殊所以不用迴圈
      if (!rules.name.regex.test(form.name)) return true;
      else if (!rules.place.regex.test(form.place)) return true;
      else if (form.description) {
        if (!rules.description.regex.test(form.description)) return true;
      } else if (!form.findDate) return true;
      if (form.categoryId.length === 0) {
        form.categoryId = "7"; // 先暫定為其他
      } else return true;
    };
    if (checkInValid(form, itemRules) === false) {
      Swal.fire({
        title: "刊登失敗!",
        text: "有資料錯誤",
        icon: "error",
        confirmButtonText: "繼續",
      });
      return;
    } else {
      try {
        const data = await postItem(form);
        console.log("送出表單" + JSON.stringify(form));
        if (data.status === "success") {
          Swal.fire({
            title: "刊登成功!",
            text: "自動跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/items/${data.apiData.id}`),
          });
        } else {
          Swal.fire({
            // 這個是API返回的失敗
            title: "刊登失敗",
            text: data.message,
            icon: "error",
            confirmButtonText: "關閉",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "刊登失敗!",
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
        {apiRes === "success" && (
          <FormContainer>
            <AuthTitle>刊登物品</AuthTitle>
            <SelectInput
              items={merchants}
              text="選擇刊登商家"
              label=" 以商家身分刊登 (不選擇則以使用者身分刊登)"
              id="merchantId"
              useRef={inputRef.merchantId}
            />
            <SelectInput
              items={categories}
              text="選擇物品分類"
              label="分類"
              id="categoryId"
              useRef={inputRef.categoryId}
            ></SelectInput>
            <FormInput
              id="name"
              label="物品名稱"
              type="text"
              placeholder="請輸入物品名稱.."
              onChange={() => handleInputOnChange("name")}
              invalidPrompt={itemRules.name.prompt}
              useRef={inputRef.name}
              minlength={itemRules.name.min}
              maxlength={itemRules.name.max}
              isRequired={true}
            />
            <FormInput
              id="description"
              label="說明"
              type="text"
              placeholder="請輸入說明.."
              onChange={() => handleInputOnChange("description")}
              invalidPrompt={itemRules.description.prompt}
              useRef={inputRef.description}
              minlength={itemRules.description.min}
              maxlength={itemRules.description.max}
              asTextarea={true}
            />
            <FormInput
              id="place"
              label="撿取地點"
              type="text"
              placeholder="請輸入撿取地點.."
              onChange={() => handleInputOnChange("place")}
              invalidPrompt={itemRules.place.prompt}
              useRef={inputRef.place}
              minlength={itemRules.place.min}
              maxlength={itemRules.place.max}
              isRequired={true}
            />
            <ImageInput
              id="photo"
              defaultImage={defaultItemPhoto}
              useRef={inputRef.photo}
              label={"上傳照片"}
            />
            <DateInput
              id="findDate"
              label="拾取日期"
              type="date"
              placeholder="請輸入說明.."
              useRef={inputRef.findDate}
              isRequired={true}
              max={new Date().toISOString().split("T")[0]}
              //今天 格式為20xx/xx/xx
            />
            <Container fluid className="d-flex justify-content-between mt-5">
              <StyledAuthButton
                className="btn btn-secondary"
                onClick={(e) => handleCancel(e)}
              >
                取消
              </StyledAuthButton>
              <StyledAuthButton
                className="btn btn-danger"
                onClick={() => window.location.reload()}
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
        {apiRes === "false" && <h1>目前無法刊登物品</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </FormContainerStyled>
    </>
  );
}

// name;
// description(選填);
// place;
// findDate;
// photo(選填);
// categoryId(選填);
// merchantId(選填);
