import styled from "styled-components";

export const SignUpBox = styled.div`
  width: 100%;
  height: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const SignInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 60%;
  height: 500px;
  margin-top: 150px;
  border-radius: 20px;
  margin-bottom: 150px;
`;

export const InputTitle = styled.div`
  font-size: 14px;
  margin-top: 30px;
  font-weight: 700;
  width: 100%;
`;

export const InputempwBox = styled.div`
  width: 100%;
`;

export const Inputempw = styled.input`
  border: none;
  border-bottom: 1px solid gray;
  margin-top: 5px;
  width: 300px;
  outline: none;

  &.inval input {
    border-color: red;
    background: #ffd7d7;
    color: red;
  }
`;

export const ButtonBox = styled.div`
  margin-top: 40px;
  width: 300px;
`;
export const ButtonSign = styled.button`
  border: none;
  height: 40px;
  border-radius: 50px;
  width: 300px;
  text-align: center;
  font-weight: bold;
  transform: 0.5;
  transition: 0.5s;
  &:hover {
    background: #de4c2a;
    color: white;
    transition: 0.5s;
  }
  cursor: pointer;
`;

export const ButtonSocial = styled.button`
  border: none;
  height: 40px;
  border-radius: 50px;
  width: 300px;
  text-align: center;
  font-size: bold;
  background-color: transparent;
  border: 1px solid black;
  font-weight: bold;
  cursor: pointer;
`;

export const SocialBtnBox = styled.div`
  margin-top: 20px;
  width: 300px;
`;

export const SocialIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 10px;
`;
export const LogoImg = styled.img`
  border-radius: 10px;
  width: 300px;
  height: 150px;
`;
export const Text = styled.div`
  margin-top: 4px;
  font-size: 10px;
  color: red;
`;
