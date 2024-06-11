import styled from "styled-components";

export const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  margin: 120px auto;
  width: 90%;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

export const InformationContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: start;
  @media screen and (max-width: 1200px) {
    align-items: center;
    width: 50%;
    margin-bottom: 30px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px 0;
  @media screen and (max-width: 1200px) {
    justify-content: center;    
    text-align:center;
  }
`;
