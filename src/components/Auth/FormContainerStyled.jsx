import { Button } from "react-bootstrap";
import styled from "styled-components";

export const FormContainerStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const StyledAuthButton = styled(Button)`
  display: block;
  margin: 20px 0;
`;
