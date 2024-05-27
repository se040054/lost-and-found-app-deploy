import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  HashRouter,
} from "react-router-dom";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  EditProfilePage,
  EditPasswordPage,
  CreateMerchantPage,
  MerchantInfoPage,
  EditMerchantPage,
  CreateItemPage,
  ItemPage,
  EditItemPage,
  SubmittedClaimPage,
  ReceivedClaimPage,
} from "./pages";
import React from "react";
import { GlobalStyles } from "./components/common/global";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthContextProvider } from "./context/AuthContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FavoriteContextProvider } from "./context/FavoriteContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const basename = process.env.PUBLIC_URL;

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={basename}>
        <ThemeContextProvider>
          <AuthContextProvider>
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <FavoriteContextProvider>
                <GlobalStyles />
                <Routes>
                  <Route path="home" element={<HomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  {/* users */}
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="users/:id" element={<ProfilePage />} />
                  <Route path="users/:id/edit" element={<EditProfilePage />} />
                  <Route
                    path="users/:id/editPassword"
                    element={<EditPasswordPage />}
                  />
                  {/* merchants */}
                  <Route
                    path="merchants/post"
                    element={<CreateMerchantPage />}
                  />
                  <Route path="merchants/:id" element={<MerchantInfoPage />} />
                  <Route
                    path="merchants/:id/edit"
                    element={<EditMerchantPage />}
                  />
                  {/* items */}
                  <Route path="items/post" element={<CreateItemPage />} />
                  <Route path="items/:id" element={<ItemPage />} />
                  <Route path="items/:id/edit" element={<EditItemPage />} />
                  {/* claims */}
                  <Route
                    path="claims/submitted"
                    element={<SubmittedClaimPage />}
                  />
                  <Route
                    path="claims/received"
                    element={<ReceivedClaimPage />}
                  />
                  {/* 其他路徑導回首頁 */}
                  <Route path="*" element={<Navigate to="home" />} />
                </Routes>
              </FavoriteContextProvider>
            </GoogleOAuthProvider>
          </AuthContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
