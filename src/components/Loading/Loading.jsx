import React from "react";
import styled from "styled-components";
import Spinner from "../../images/Spinner-1s-200px.gif";
export default function Loading() {
  return (
    <Background>
      <LoadingText>Loading</LoadingText>
      <img src={Spinner} alt="로딩중" width="5%" />
    </Background>
  );
}

export const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font: 1rem "Noto Sans KR";
  text-align: center;
`;
