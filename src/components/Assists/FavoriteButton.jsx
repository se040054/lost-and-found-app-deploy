import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useFavorite } from "../../context/FavoriteContext";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// 右上角的絕對定位按鈕 !!注意這個按鈕需要父層為relative!!
export const AbsoluteFavoriteButton = ({ itemId }) => {
  const { isLogin } = useAuth();
  const { favoriteItemsId, addFavorite, removeFavorite } = useFavorite();
  const isFavorite = favoriteItemsId.includes(itemId);
  const navigate = useNavigate();
  const handleFavorite = async (itemId) => {
    if (isLogin !== "success") {
      const result = await Swal.fire({
        title: "尚未登入!",
        text: "登入後可使用收藏功能，要馬上登入嗎?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "登入",
        cancelButtonText: "取消",
      });
      if (result.isConfirmed) navigate("/login");
      if (result.isDenied) return;
    } else {
      try {
        if (isFavorite) {
          await removeFavorite(itemId);
        } else {
          await addFavorite(itemId);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
  };
  return (
    <Heart onClick={() => handleFavorite?.(itemId)}>
      {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
    </Heart>
  );
};

const Heart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  top: 15px;
  right: 15px;
  position: absolute;
  width: 38px;
  height: 38px;
  color: #e3395b;
  cursor: pointer;
  background-color: ${(props) => props.theme.heartBackground};
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.heartBorder};
  transition: color 0.3s, transform 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

// 普通定位按鈕
export const StaticFavoriteButton = ({ itemId }) => {
  const { isLogin } = useAuth();
  const { favoriteItemsId, addFavorite, removeFavorite } = useFavorite();
  const isFavorite = favoriteItemsId.includes(itemId);
  const navigate = useNavigate();
  const handleFavorite = async (itemId) => {
    if (isLogin !== "success") {
      const result = await Swal.fire({
        title: "尚未登入!",
        text: "登入後可使用收藏功能，要馬上登入嗎?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "登入",
        cancelButtonText: "取消",
      });
      if (result.isConfirmed) navigate("/login");
      if (result.isDenied) return;
    } else {
      try {
        if (isFavorite) {
          await removeFavorite(itemId);
        } else {
          await addFavorite(itemId);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
  };
  return (
    <StaticHeart onClick={() => handleFavorite?.(itemId)}>
      {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
    </StaticHeart>
  );
};

const StaticHeart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #e3395b;
  cursor: pointer;
  background-color: ${(props) => props.theme.heartBackground};
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.heartBorder};
  transition: color 0.3s, transform 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;
