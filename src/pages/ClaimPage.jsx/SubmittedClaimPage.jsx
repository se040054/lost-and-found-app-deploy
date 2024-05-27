import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import Header from "../../components/Assists/Header";
import { useEffect, useState } from "react";
import { deleteClaim, getSubmittedClaims } from "../../api/claims";
import { defaultItemPhoto } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  MainContainer,
  TitleContainer,
} from "../../components/common/claimStyled";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";
import Swal from "sweetalert2";

export default function SubmittedClaimPage() {
  const { isLogin } = useAuth();
  const [claims, setClaims] = useState([]);
  const [apiRes, setApiRes] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getSubmittedClaims();
        if (data.status === "success") {
          setClaims(data.apiData);
          setApiRes("success");
        } else {
          setClaims(null);
          setApiRes("false");
        }
      } catch (error) {
        setClaims(null);
        setApiRes("false");
        console.log(error);
      }
    };
    if (isLogin === "false") navigate("/login");
    if (isLogin === "success") fetchClaims();
  }, [isLogin, navigate]);
  const handleDelete = (claimId) => {
    setClaims(claims.filter((claim) => claim.id !== claimId));
  };
  return (
    <>
      <Header />
      <NavigationToolContainer>
        <BackToTopButton />
        <GoBackButton />
        <BackHomeButton />
      </NavigationToolContainer>
      <MainContainer>
        <TitleContainer>
          <h2 className="m-0 p-0 fw-bold">我送出的認領</h2>
          <Link className="position-absolute end-0" to="/claims/received">
            <Button className="btn-success">查看我收到的認領申請</Button>{" "}
          </Link>
        </TitleContainer>
        <hr className="w-100" />
        {apiRes === "success" && (
          <ClaimsContainer
            claims={claims}
            handleDelete={handleDelete}
          ></ClaimsContainer>
        )}
        {apiRes === "false" && <h1>請稍後再試</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainer>
    </>
  );
}

const ClaimsContainer = ({ claims, handleDelete }) => {
  return (
    <CardGroup className="w-100 m-0 p-0">
      {claims?.length > 0 && (
        <Row xs={1} xl={1} className="w-100 m-0 p-0">
          {claims.map((claim) => {
            return (
              <Col className="w-100 m-0 p-0" key={claim.id}>
                <ClaimWrapper
                  claim={claim}
                  handleDelete={handleDelete}
                ></ClaimWrapper>
              </Col>
            );
          })}
        </Row>
      )}
      {claims?.length === 0 && (
        <>
          <h4>目前尚未申請過認領</h4>
        </>
      )}
    </CardGroup>
  );
};

const ClaimWrapper = ({ claim, handleDelete }) => {
  const apiDeleteClaim = async (id) => {
    try {
      const data = await deleteClaim(id);
      if (data.status === "success") {
        handleDelete(claim.id);
        Swal.fire({
          title: "已撤銷認領",
          icon: "success",
          confirmButtonText: "繼續",
        });
      } else {
        Swal.fire({
          title: "撤銷認領失敗",
          icon: "error",
          confirmButtonText: "繼續",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "撤銷認領失敗",
        icon: error.message,
        confirmButtonText: "繼續",
      });
    }
  };
  const handleClick = async (id) => {
    const result = await Swal.fire({
      title: "確定要撤銷認領嗎",
      text: "返回後對方將不會收到認領申請",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "撤銷",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "取消",
    });
    if (result.isConfirmed) {
      await apiDeleteClaim(id);
    }
    if (result.isDenied) return;
  };
  const approveText = (state) => {
    if (state === true) return <p className="text-success">認領成功</p>;
    else if (state === false) return <p className="text-danger">認領失敗</p>;
    else if (state === null)
      return (
        <>
          <Container className="m-0 p-0 d-flex align-items-center">
            <p className="text-muted m-0 p-0 me-2">尚未回應</p>
            <Button
              className="btn btn-danger m-0"
              onClick={() => handleClick?.(claim.id)}
            >
              取消認領
            </Button>
          </Container>
        </>
      );
  };
  function formatDate(rawDate) {
    // node 時間已經為UTC+8
    const date = new Date(rawDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 月份從0開始 要+1
    const day = date.getUTCDate();
    return `${year}年${month}月${day}日`;
  }
  return (
    <Card className="mb-3">
      <Row>
        <Col md={3}>
          <Link to={`/items/${claim.itemId}`}>
            <Card.Img
              variant="none" // 取消圖像的邊角radius
              src={claim.Item.photo || defaultItemPhoto}
              style={{
                width: "100%",
                height: "200px",
                display: "block",
                objectFit: "contain",
                overflow: "hidden",
              }}
            />
          </Link>
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <Link to={`/items/${claim.itemId}`}>
            <Card.Body>
              <Card.Title>{claim?.Item.name}</Card.Title>
            </Card.Body>
          </Link>
        </Col>

        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            <Card.Title>認領時間：</Card.Title>
            <Card.Text>
              <small className="text-muted">
                {formatDate?.(claim?.createdAt)}
              </small>
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            <Card.Title>申請狀態：</Card.Title>
            <Card.Text>{approveText(claim.isApproved)}</Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
