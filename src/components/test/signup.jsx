import { useState, useEffect, useRef } from "react";
import { auth, db } from "../apis/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import styled from "styled-components";
import Loading from "../Loading/Loading";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // 초기값 세팅 - 이메일, 닉네임, 비밀번호, 비밀번호 확인
  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  // 에러 메시지
  const [idErrMsg, setIdErrMsg] = useState("");
  const [nickNameErrMsg, setNickNameErrMsg] = useState("");
  const [pwErrMsg, setPwErrMsg] = useState("");
  const [pwConfirmErrMsg, setPwConfirmErrMsg] = useState("");

  // 유효성 검사
  const [isId, setIsId] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isPwConfirm, setIsPwConfirm] = useState(false);
  const [isNickName, setIsNickName] = useState(false);

  // 에러 나면 그곳에 커서 이동되도록
  const idRef = useRef(null);
  const nickNameRef = useRef(null);
  const pwRef = useRef(null);
  const pwConfirmRef = useRef(null);

  // 회원가입 완료
  const signup = async (e) => {
    setLoading(true);
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, id, pw).then((data) => {
      if (auth.currentUser)
        updateProfile(auth?.currentUser, {
          displayName: nickName,
        })
          .then(() => {
            alert("회원가입이 완료되었습니다");
            console.log("data", data);
            setId("");
            setNickName("");
            setPw("");
            sessionStorage.setItem("id", nickName);
            sessionStorage.setItem("email", data.user.email);
            addDoc(collection(db, "users"), {
              email: data.user.email,
              name: data.user.displayName,
            });
            setLoading(false);
            navigate("/");
          })
          .catch((error) => {
            console.log(error.message);
            alert("회원가입을 다시 진행해주세요.");
            navigate("/signup");
          });
    });
  };

  // useEffect(() => {
  //   setValue(sessionStorage.getItem("email"));
  // });

  //* id (이메일)
  const onChangeId = (e) => {
    const currentId = e.target.value;
    setId(currentId);
    const idRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!idRegex.test(currentId)) {
      setIdErrMsg(" 잘못된 이메일 주소입니다.");
      setIsId(false);
    } else {
      setIdErrMsg("");
      setIsId(true);
    }
  };

  //* 닉네임
  const onChangeNickName = (e) => {
    const currentNickName = e.target.value;
    setNickName(currentNickName);

    if (currentNickName.length < 2 || currentNickName.length > 10) {
      setNickNameErrMsg(" 2글자 이상, 10글자 미만으로만 사용할 수 있습니다.");
      setIsNickName(false);
    } else {
      setNickNameErrMsg("");
      setIsNickName(true);
    }
  };

  //* 비밀번호
  const onChangePw = (e) => {
    const currentPw = e.target.value;
    setPw(currentPw);
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!pwRegex.test(currentPw)) {
      setPwErrMsg("숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요.");
      setIsPwConfirm(false);
    } else {
      setPwErrMsg("");
    }
  };

  //* 비밀번호 확인
  const onChangePwConfirm = (e) => {
    const currentPwConfirm = e.target.value;
    setPwConfirm(currentPwConfirm);
    if (pw === currentPwConfirm) {
      setPwConfirmErrMsg("");
      setIsPwConfirm(true);
    } else {
      setPwConfirmErrMsg("비밀번호가 일치하지 않습니다.");
      setIsPwConfirm(false);
    }
  };

  return (
    <SignUpContainer>
      {loading === true ? <Loading /> : null}
      <Id>
        <Label>이메일</Label>{" "}
        <Input onChange={onChangeId} value={id} ref={idRef} />
      </Id>
      <Error>
        {id.length > 0 && (
          <span className={`message ${isId ? "success" : "error"}`}>
            {idErrMsg}
          </span>
        )}
      </Error>
      <Name>
        <Label>닉네임 </Label>{" "}
        <Input
          onChange={onChangeNickName}
          value={nickName}
          maxLength={10}
          ref={nickNameRef}
        />
      </Name>
      <Error>
        <span className={`message ${isNickName ? "success" : "error"}`}>
          {nickNameErrMsg}
        </span>
      </Error>
      <Password>
        <Label>비밀번호 </Label>
        <Input onChange={onChangePw} value={pw} ref={pwRef} type="password" />
      </Password>
      <Error>
        <span className={`message ${isPw ? "success" : "error"}`}>
          {pwErrMsg}
        </span>
      </Error>
      <PasswordCheck>
        <PasswordCheckLabel>비밀번호 확인</PasswordCheckLabel>

        <Input
          type="password"
          ref={pwConfirmRef}
          value={pwConfirm}
          onChange={onChangePwConfirm}
        />
      </PasswordCheck>
      <Error>
        <span className={`message ${isPwConfirm ? "success" : "error"}`}>
          {pwConfirmErrMsg}
        </span>
      </Error>
      <div>
        <BlueButton onClick={signup}>회원가입</BlueButton>
      </div>
    </SignUpContainer>
  );
};
export default SignUpPage;

const Error = styled.div`
  font-size: 12px;
  padding: 5px;
  .message {
    &.error {
      color: red;
    }
  }
`;

const Id = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
`;

const Password = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  padding-right: 5px;
`;

const PasswordCheck = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  padding-right: 30px;
`;

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const Label = styled.div`
  display: flex;
`;

const PasswordCheckLabel = styled.div`
  white-space: nowrap;
  /* font-size: 10px; */
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  color: #555;
  box-sizing: border-box;
  font-size: 18px;
  :focus-visible {
    outline: none;
  }
  margin-top: 3px;
  padding-left: 5px;
`;

const BlueButton = styled.button`
  align-items: center;
  background-color: #555555;
  border-radius: 5px;
  width: 250px;
  height: 40px;
  color: #ffff;
  font-size: 15px;
  cursor: pointer;
`;
