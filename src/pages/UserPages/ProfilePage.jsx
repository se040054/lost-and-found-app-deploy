import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser } from "../../api/user";
import Header from "../../components/Assists/Header";
import styled from "styled-components";
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
import {
  defaultAvatar,
  defaultItemPhoto,
  defaultMerchantLogo,
} from "../../assets";
import { getMyFavorites } from "../../api/favorites";
import {
  InfoRow,
  InformationContainerStyled,
  MainContainerStyled,
} from "../../components/common/profileStyled";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { AbsoluteFavoriteButton } from "../../components/Assists/FavoriteButton";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";
export default function ProfilePage() {
  const { currentMember } = useAuth();
  const userId = useParams().id;
  const [profile, setProfile] = useState();
  const [apiRes, setApiRes] = useState("loading"); // api 有三種狀態，未回傳，回傳成功，回傳失敗 ，避免Effect執行前頁面先渲染錯誤結果
  const [favorites, setFavorites] = useState([]); // 注意這個收藏是物品，而非context的id陣列
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser(userId);
        if (!data.apiData) {
          setProfile(null);
          setApiRes("false");
          return;
        }
        setProfile(data.apiData);
        if (profile?.id === currentMember?.id) {
          const data = await getMyFavorites();
          setFavorites(data.apiData);
        }
        setApiRes("success");
      } catch (error) {
        console.log(error);
        setApiRes("false");
        return error;
      }
    };
    fetchUserData();
  }, [userId, apiRes, currentMember?.id, profile?.id]);

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
              profile={profile}
              currentMemberId={currentMember?.id}
            />
            <PropertiesContainer
              profile={profile}
              showFavorite={currentMember?.id === profile.id}
              favorites={favorites || null}
            />
          </>
        )}
        {apiRes === "false" && <h1>找不到用戶</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainerStyled>
    </>
  );
}

const InformationContainer = ({ profile, currentMemberId }) => {
  return (
    <InformationContainerStyled>
      <Container fluid className="my-2 my-0 p-0 w-100 h-100">
        <Image
          src={profile?.avatar || defaultAvatar}
          roundedCircle
          // 注意這裡如果用react 屬性設置寬高會導致大小不一
          style={{
            border: "1px solid gray",
            objectFit: "contain",
            width: "240px",
            height: "240px",
          }}
        />
      </Container>
      <Container fluid className="my-2 my-0 p-0">
        <InfoRow>
          <h2>{profile.name}</h2>
        </InfoRow>
        <InfoRow>
          <MdEmail />
          <p className="fst-italic p-0 m-0 ms-1">{profile.email || "無"}</p>
        </InfoRow>
        <InfoRow>
          <FaPhoneAlt />
          <p className="fst-italic p-0 m-0 ms-1">{profile.phone || "無"}</p>
        </InfoRow>
        <InfoRow>
          <IoLocationSharp />
          <p className="fst-italic p-0 m-0 ms-1">{profile.county || "無"}</p>
        </InfoRow>
      </Container>
      {profile?.id === currentMemberId && (
        <Button
          className="btn btn-success w-75"
          href={`/users/${currentMemberId}/edit`}
        >
          編輯資料
        </Button>
      )}
    </InformationContainerStyled>
  );
};

const PropertiesContainer = ({ profile, showFavorite, favorites }) => {
  return (
    <div className="d-flex  flex-column ms-5 w-75">
      <Tabs id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="items" title="刊登物品">
          {/* 注意這個Tab不能抽離出Tabs 除非用其他組件 */}
          <ItemsContainer items={profile?.Items}></ItemsContainer>
        </Tab>
        <Tab eventKey="merchants" title="商家列表">
          <MerchantsContainer
            merchants={profile?.Merchants}
          ></MerchantsContainer>
        </Tab>
        {showFavorite && (
          <Tab eventKey="favorites" title="收藏列表">
            {favorites.length < 1 ? (
              <h1>空空如也~ </h1>
            ) : (
              <ItemsContainer items={favorites}></ItemsContainer>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

const ItemsContainer = ({ items }) => {
  return (
    <CardGroup>
      {items?.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-2 w-100">
          {items.map((item) => {
            return (
              <Col key={item.id}>
                <Container className="position-relative p-0 m-0">
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
          <h1>這個人沒有刊登物品</h1>
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
          fluid
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

const MerchantsContainer = ({ merchants }) => {
  return (
    <CardGroup>
      {merchants?.length > 0 && (
        <Row xs={1} xl={1} className="w-100">
          {merchants.map((merchant) => {
            return (
              <Col key={merchant.id}>
                <MerchantWrapper merchant={merchant}></MerchantWrapper>
              </Col>
            );
          })}
        </Row>
      )}
      {merchants?.length === 0 && (
        <>
          <h1>這個人沒有商家</h1>
        </>
      )}
    </CardGroup>
  );
};

const MerchantWrapper = ({ merchant }) => {
  return (
    <Link to={`/merchants/${merchant.id}`}>
      <Card fluid className="mb-3">
        <Row fluid>
          <Col md={3}>
            <Card.Img
              src={merchant.logo || defaultMerchantLogo}
              alt="..."
              style={{
                width: "260px",
                height: "260px",
                objectFit: "contain",
              }}
            />
          </Col>
          <Col md={9}>
            <Card.Body>
              <Card.Title>{merchant.name}</Card.Title>
              <Card.Text>
                <small className="text-muted">{merchant.address}</small>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Link>
  );
};
