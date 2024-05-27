import {
  Button,
  Card,
  CardGroup,
  Col,
  Dropdown,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import Header from "../../components/Assists/Header";
import { useEffect, useState } from "react";
import { getReceivedClaims, putClaim } from "../../api/claims";
import { defaultAvatar, defaultItemPhoto } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  MainContainer,
  TitleContainer,
} from "../../components/common/claimStyled";
import Swal from "sweetalert2";
import {
  BackHomeButton,
  BackToTopButton,
  GoBackButton,
  NavigationToolContainer,
} from "../../components/Assists/NavigationTool";

export default function ReceivedClaimsPage() {
  const { isLogin } = useAuth();
  const [claims, setClaims] = useState([]);
  const [apiRes, setApiRes] = useState("loading");
  const [put, setPut] = useState("no"); // 這個狀態本身沒有意義，用來在修改後重新fetch整個claims
  const navigate = useNavigate();
  const pendingClaims = [];
  const resolvedClaims = [];
  claims.forEach((claim) => {
    if (claim.isApproved === null) pendingClaims.push(claim);
    else resolvedClaims.push(claim);
  });
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getReceivedClaims();
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
      }
    };
    if (isLogin === "false") navigate("/login");
    if (isLogin === "success") fetchClaims();
    setPut("no");
  }, [isLogin, navigate, put]);
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
          <h2 className="m-0 p-0 fw-bold">我收到的認領</h2>
          <Link className="position-absolute end-0" to="/claims/submitted">
            <Button className="btn-success">查看我送出的認領申請</Button>{" "}
          </Link>
        </TitleContainer>
        <hr className="w-100" />
        {apiRes === "success" && (
          <>
            <>
              <h5> 待處理的申請 </h5>
              {pendingClaims.length > 0 ? (
                <ClaimsContainer
                  refetch={setPut}
                  claims={pendingClaims}
                ></ClaimsContainer>
              ) : (
                <p>目前沒有申請~</p>
              )}
            </>
            <hr className="w-100" />
            <>
              <h5> 已處理完成的申請 </h5>
              {resolvedClaims.length > 0 ? (
                <ClaimsContainer claims={resolvedClaims}></ClaimsContainer>
              ) : (
                <p>目前沒有申請~</p>
              )}
            </>
          </>
        )}
        {apiRes === "false" && <h1>請稍後再試</h1>}
        {apiRes === "loading " && (
          <Spinner animation="border" variant="success" />
        )}
      </MainContainer>
    </>
  );
}

const ClaimsContainer = ({ claims, handlePut, refetch }) => {
  return (
    <CardGroup className="w-100 m-0 p-0">
      <Row xs={1} xl={1} className="w-100 m-0 p-0">
        {claims.map((claim) => {
          return (
            <Col key={claim.id} className="w-100 m-0 p-0">
              <ClaimWrapper
                refetch={refetch}
                handlePut={handlePut}
                claim={claim}
                isResolved={claim.isApproved !== null}
              ></ClaimWrapper>
            </Col>
          );
        })}
      </Row>
    </CardGroup>
  );
};

const ClaimWrapper = ({ claim, isResolved, refetch }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const fetchPutClaim = async (claimId, action) => {
    try {
      const data = await putClaim({ id: claimId, action });
      console.log("api" + data.apiData);
      if (data.status === "success") {
        Toast.fire({
          icon: "success",
          title: "回應成功",
        });
        refetch?.("yes");
      } else {
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      console.log("apiError" + error.message);
      Toast.fire({
        icon: "error",
        title: error.message,
      });
      return error;
    }
  };
  const handleSelect = async (eKey, e, claimId) => {
    let toastTitle;
    let toastText;
    let btnText;
    if (eKey === "true") {
      toastTitle = `確認${claim.Item.name} 為 ${claim.User.name} 的遺失物品`;
      toastText = "確認認領使用者後，會自動拒絕其他所有對此物品申請的認領";
      btnText = "批准";
    } else if (eKey === "false") {
      toastTitle = "即將拒絕申請";
      toastText = `確認${claim.Item.name} 並非 ${claim.User.name} 的遺失物品`;
      btnText = "拒絕";
    }
    const result = await Swal.fire({
      title: toastTitle,
      text: toastText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: btnText,
      cancelButtonText: "取消",
    });
    if (result.isConfirmed) {
      await fetchPutClaim(claimId, eKey);
      // 目前set方法會導致bug，並且由於可能會在申請後操作所有claims所以使用重整，並且reload會導致toast消失
    }
    if (result.isDenied) return;
    console.log(eKey);
  };

  const approveText = (state) => {
    if (state === true) return <small className="text-success">已批准</small>;
    else if (state === false)
      return <small className="text-danger">已拒絕</small>;
    else if (state === null)
      return <small className="text-muted">尚未回應</small>;
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
      <Row className="d-flex align-items-center m-0 ps-3 py-2">
        <Card.Title className="p-0 m-0">
          <a href={`/users/${claim.User?.id}`}>
            <Image
              src={claim.User?.avatar || defaultAvatar}
              alt="avatar"
              style={{
                marginRight: "6px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />

            <small>{claim.User?.name}</small>
          </a>
        </Card.Title>
      </Row>
      <hr className="w-100 m-0 p-0"></hr>
      <Row>
        <Col md={3}>
          <Link to={`/items/${claim.itemId}`}>
            <Card.Img
              variant="none" // 取消圖像的邊角radius
              src={claim.Item?.photo || defaultItemPhoto}
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
              <Card.Title>{claim.Item?.name}</Card.Title>
            </Card.Body>
          </Link>
        </Col>

        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            <Card.Title>申請時間：</Card.Title>
            <Card.Text>
              <small className="text-muted">
                {formatDate?.(claim?.createdAt)}
              </small>
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <Card.Body>
            {isResolved ? (
              <Card.Text>{approveText(claim.isApproved)}</Card.Text>
            ) : (
              <Card.Title>
                <Dropdown
                  onSelect={(eKey, e) => handleSelect?.(eKey, e, claim.id)}
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    回應
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="text-success fs-4 my-2"
                      eventKey={"true"} // 目前先用字串
                    >
                      批准
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger fs-4 my-2"
                      eventKey={"false"}
                    >
                      拒絕
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Title>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
