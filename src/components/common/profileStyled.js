import styled from "styled-components";

export const MainContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  margin: 120px auto;
  width: 80%;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const InformationContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: start;
  @media screen and (max-width: 700px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px 0;
`;
