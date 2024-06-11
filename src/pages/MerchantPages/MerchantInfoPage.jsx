import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Assists/Header";
import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { defaultItemPhoto, defaultMerchantLogo } from "../../assets";
import { deleteMerchant, getMerchant } from "../../api/merchants";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import {
  InfoRow,
  InformationContainerStyled,
  MainContainerStyled,
} from "../../components/common/profileStyled";
import Swal from "sweetalert2";
import { AbsoluteFavoriteButton } from "../../components/Assists/FavoriteButton";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";

export default function MerchantInfoPage() {
  const { currentMember } = useAuth();
  const merchantId = useParams().id;
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState();
  const [apiRes, setApiRes] = useState("loading"); // api 有三種狀態，未回傳，回傳成功，回傳失敗 ，避免Effect執行前頁面先渲染錯誤結果
  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await getMerchant(merchantId);
        if (!data.apiData) {
          setMerchant(null);
          setApiRes("false");
          return;
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
  }, [merchantId]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "確定要刪除商家嗎?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除商家",
      confirmButtonColor: "#dc3545",
      cancelButtonText: `取消`,
    });
    if (result.isConfirmed) {
      try {
        const data = await deleteMerchant(merchant.id);
        if (data.status === "success") {
          Swal.fire({
            title: "已刪除!",
            text: "跳轉頁面",
            confirmButtonText: "繼續",
            willClose: () => navigate(`/users/${currentMember.id}`),
          });
        } else {
          Swal.fire({
            title: "刪除失敗!",
            icon: "error",
            text: data.message,
            confirmButtonText: "繼續",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "刪除失敗!",
          icon: "error",
          text: error.message,
          confirmButtonText: "繼續",
        });
      }
    }
    if (result.isDenied) return;

    console.log(result);
  };
  return (
    <>
      <Header />
      <NavigationToolContainer>
        <BackToTopButton />
        <GoBackButton />
        <BackHomeButton />
      </NavigationToolContainer>
      <MainContainerStyled>
        {apiRes === "success" && (
          <>
            <InformationContainer
              merchant={merchant}
              currentMemberId={currentMember?.id}
              handleDelete={handleDelete}
            />
            <PropertiesContainer items={merchant.Items} />
          </>
        )}
        {apiRes === "false" && <h1>此商家不存在</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainerStyled>
    </>
  );
}
const InformationContainer = ({ merchant, currentMemberId, handleDelete }) => {
  return (
    <InformationContainerStyled>
     
        <Image
          src={merchant?.logo || defaultMerchantLogo}
          thumbnail
          // 注意這裡如果用react 屬性設置寬高會導致大小不一
          style={{
            border: "1px solid gray",
            objectFit: "contain",
            width: "240px",
            height: "240px",
          }}
        />
     
      <Container fluid className="my-2 my-0 p-0 ">
        <InfoRow>
          <h2>{merchant?.name}</h2>
        </InfoRow>
        <InfoRow>
          <FaUserCircle />
          <Link to={`/users/${merchant.userId}`}>
            <p className="text-primary fw-bolder p-0 m-0 ms-1">
              {merchant?.User.name}
            </p>
          </Link>
        </InfoRow>
        <InfoRow>
          <FaPhoneAlt />
          <p className="fst-italic p-0 m-0 ms-1">{merchant.phone}</p>
        </InfoRow>
        <InfoRow>
          <IoLocationSharp />
          <p className="fst-italic p-0 m-0 ms-1">{merchant.address}</p>
        </InfoRow>
      </Container>
      {merchant.userId === currentMemberId && (
        <Container className="p-0 d-flex flex-xl-row flex-column justify-content-between align-items-center">
          <Link to={`/merchants/${merchant.id}/edit`}>
            <Button className="btn btn-success mb-2">編輯商家資料</Button>
          </Link>
          <Button
            className="btn btn-danger mb-2"
            onClick={(e) => handleDelete?.()}
          >
            刪除商家
          </Button>
        </Container>
      )}
    </InformationContainerStyled>
  );
};

const PropertiesContainer = ({ items }) => {
  return (
    <div className="d-flex  flex-column ms-5 w-75">
      <Tabs id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="items" title="刊登物品">
          {/* 注意這個Tab不能抽離出Tabs 除非用其他組件 */}
          <ItemsContainer items={items}></ItemsContainer>
        </Tab>
      </Tabs>
    </div>
  );
};

const ItemsContainer = ({ items }) => {
  return (
    <CardGroup>
      {items?.length > 0 && (
        <Row xs={1} sm={2} md={2} lg={3} xl={3} xxl={4} className="g-2 w-100">
          {items.map((item) => {
            return (
              <Col key={item.id}>
                <Container className="position-relative m-0 p-0">
                  <ItemWrapper item={item}></ItemWrapper>
                  <AbsoluteFavoriteButton itemId={item.id} />
                </Container>
              </Col>
            );
          })}
        </Row>
      )}
      {items?.length === 0 && (
        <>
          <h1>這個商家沒有刊登物品</h1>
        </>
      )}
    </CardGroup>
  );
};

const ItemWrapper = ({ item }) => {
  return (
    <Link to={`/items/${item.id}`}>
      <Card className="mb-3" style={{ maxWidth: "540px" }}>
        <Card.Img
          src={item.photo || defaultItemPhoto}
          alt="item-photo"
          style={{
            width: "auto",
            height: "200px",
            objectFit: "cover",
          }}
        />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            <small className="text-muted">{item.place}</small>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};
