import FormContainer from "../../components/Auth/FormContainer";
import FormInput from "../../components/Auth/FormInput";
import { AuthTitle } from "../../components/Auth/AuthPageStyled";
import Header from "../../components/Assists/Header";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { defaultItemPhoto } from "../../assets";
import ImageInput from "../../components/Auth/ImageInput";
import { itemRules } from "../../utils/inputRules";
import Swal from "sweetalert2";
import { Container, Spinner } from "react-bootstrap";
import {
  FormContainerStyled,
  StyledAuthButton,
} from "../../components/Auth/FormContainerStyled";
import { editItem, getItem } from "../../api/items";
import DateInput from "../../components/Auth/DateInput";
import SelectInput from "../../components/Auth/SelectInput";
import { getCategories } from "../../api/categories";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";

export default function EditItemPage() {
  const { currentMember, isLogin } = useAuth(); // 注意currentMember是異步，可能導致使用者被檢測未登入所以下面掛載loading
  const [apiRes, setApiRes] = useState("loading"); // 避免Effect先檢測
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const itemId = useParams().id;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (isLogin === "false") navigate("/login");
      try {
        const data = await getItem(itemId);
        if (!data.apiData) {
          setItem(null);
          setApiRes("false");
          return;
        }
        if (isLogin === "success" && data.apiData.userId !== currentMember.id) {
          Swal.fire({
            title: "權限不足!",
            text: "不能修改別人的物品",
            icon: "error",
            confirmButtonText: "繼續",
            willClose: () => navigate("/home"),
          });
        }
        const CategoriesData = await getCategories();
        setCategories(CategoriesData.apiData);
        setItem(data.apiData);
        setApiRes("success"); //加載完商家資料
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchData();
  }, [itemId, isLogin, navigate, currentMember?.id]);

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
    };
    const checkEdit = (form, item) => {
      //如果某個欄位的值沒變 就把他從表單清除不送出
      Object.keys(form).forEach((attr) => {
        console.log(form[attr], item[attr]);
        if (form[attr] === item[attr]) form[attr] = null;
      });
    };
    checkEdit(form, item);
    const checkInValid = (form, rules) => {
      // 檢查值比較少且特殊所以不用迴圈
      if (!rules.name.regex.test(form.name)) return true;
      else if (!rules.place.regex.test(form.place)) return true;
      else if (form.description) {
        // 敘述非必填
        if (!rules.description.regex.test(form.description)) return true;
      } else return false;
    };
    function hasChange(obj) {
      // 檢查是否整張表單都與修改前相同
      let change = false;
      Object.keys(obj).forEach((key) => {
        if (obj[key]) change = true;
      });
      return change;
    }
    if (checkInValid(form, itemRules)) {
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
        console.log("即將送出表單" + JSON.stringify(form.findDate));
        const data = await editItem({ id: itemId, form });
        console.log(data);
        if (data.status === "success") {
          Swal.fire({
            title: "修改成功!",
            text: "即將跳轉頁面",
            timer: 3000,
            confirmButtonText: "繼續",
            willClose: () => navigate(`/items/${itemId}`),
          });
        } else {
          Swal.fire({
            // 這個是API返回的失敗
            title: "修改失敗",
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
    navigate(`/items/${itemId}`);
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
            <AuthTitle>編輯物品</AuthTitle>
            <SelectInput
              items={categories}
              text="選擇物品分類"
              label="分類  (不選擇則維持原分類)"
              id="categoryId"
              useRef={inputRef.categoryId}
              defaultValue={item.categoryId}
            ></SelectInput>
            <FormInput
              id="name"
              label="物品名稱"
              type="text"
              placeholder="請輸入物品名稱.."
              onChange={() => handleInputOnChange("name")}
              invalidPrompt={itemRules.name.prompt}
              useRef={inputRef.name}
              defaultValue={item.name}
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
              defaultValue={item.description}
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
              defaultValue={item.place}
              minlength={itemRules.place.min}
              maxlength={itemRules.place.max}
              isRequired={true}
            />
            <ImageInput
              id="photo"
              defaultImage={item.photo || defaultItemPhoto}
              useRef={inputRef.photo}
              label={"上傳照片"}
            />
            <DateInput
              id="findDate"
              label="拾取日期"
              type="date"
              placeholder="請輸入說明.."
              defaultValue={item.findDate}
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
        {apiRes === "false" && <h1>目前無法刊登物品</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </FormContainerStyled>
    </>
  );
}
