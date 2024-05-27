import styled from "styled-components";

export const AuthPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const AuthMainContainer = styled.div`
  padding-top:10px;
  display: flex;
  justify-content: center;
  width: 50%;
  height: 100%; 
`;

export const AuthContainer = styled.div`display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 60%;
  height: 100%; 
`
export const AuthBannerContainer = styled.div`
  position:fixed;
  right:0;  
  bottom:0;
  top:0;
  width:50%;
  height:100%;
`

export const AuthBanner = styled.div`
  background-image:url('https://iili.io/Ji5XFJ2.jpg');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width:100%;
  height:100%;
`;

export const AuthButton = styled.button`
  border-radius: 5px;
  background-color: #217c4a;
  border: none;
  cursor: pointer;
  color: white;
  min-width: 300px;
  height:40px;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: bold;
  padding: 6px 0;
  margin: 2rem 0;
  &:hover {
    cursor: pointer;
  }
`;

export const AuthTitle = styled.div`
  margin: 30px auto 10px auto;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

export const AuthLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center; 
`;
