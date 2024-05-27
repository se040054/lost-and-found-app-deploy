import { createContext, useContext, useEffect, useState } from "react";
import { deleteFavorite, getMyFavorites, postFavorite } from "../api/favorites";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const defaultFavoriteContext = {
  favoriteItemsId: [],
  addFavorite: null,
  removeFavorite: null,
};

const FavoriteContext = createContext(defaultFavoriteContext);

export const useFavorite = () => useContext(FavoriteContext);

export const FavoriteContextProvider = ({ children }) => {
  const { isLogin } = useAuth();
  const [favoriteItemsId, setFavoriteItemsId] = useState([]);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const favoriteData = await getMyFavorites();
        if (favoriteData.status === "success") {
          const favoritesId = favoriteData.apiData.map(
            (favorite) => favorite.id
          );
          setFavoriteItemsId(favoritesId);
        } else {
          Swal.fire({
            title: "獲取收藏失敗!",
            text: favoriteData.message,
            icon: "error",
            confirmButtonText: "繼續",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "獲取收藏失敗!",
          text: error.message,
          icon: "error",
          confirmButtonText: "繼續",
        });
        console.log(error);
        return error;
      }
    };
    if (isLogin === "success") fetchFavorite();
  }, [isLogin]);
  // 由於收藏可能是短時間頻繁操作，確保前後端一致的情形下不重新fetch資料
  const addFavoriteProvider = async (itemId) => {
    try {
      const data = await postFavorite(itemId);
      if (data.status === "success") {
        setFavoriteItemsId([...favoriteItemsId, itemId]);
      }
    } catch (error) {
      Swal.fire({
        title: "新增收藏失敗!",
        text: error.message,
        icon: "error",
        confirmButtonText: "繼續",
      });
      console.log(error);
      return error;
    }
  };
  const removeFavoriteProvider = async (itemId) => {
    try {
      const data = await deleteFavorite(itemId);
      if (data.status === "success") {
        setFavoriteItemsId(favoriteItemsId.filter((id) => id !== itemId));
      }
    } catch (error) {
      Swal.fire({
        title: "移除收藏失敗!",
        text: error.message,
        icon: "error",
        confirmButtonText: "繼續",
      });
      console.log(error);
      alert(error.message);
    }
  };
  return (
    <FavoriteContext.Provider
      value={{
        favoriteItemsId: favoriteItemsId,
        addFavorite: addFavoriteProvider,
        removeFavorite: removeFavoriteProvider,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
