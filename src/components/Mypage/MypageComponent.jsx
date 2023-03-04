import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import blankProfiles from "../../images/blankProfiles.png";
import {
  ProfileBox,
  ProfileInput,
  Profoleimg,
  Label,
  ProfileBoxDetail,
  ProfileName,
  ProfileNameBtn,
} from "./MypageComponent";
import { auth, db, storage } from "../../firebase";
import {
  deleteUser,
  onAuthStateChanged,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

export default function MypageComponent({
  setUserImage,
  userImage,
  userNick,
  setUserNick,
}) {
  const { isDark } = useContext(ThemeContext);
  // console.log(isDark);
  const [imgFile, setImgFile] = useState("");
  const [userDocId, setUserDocId] = useState("");
  const imgRef = useRef();
  const navigate = useNavigate();
  const nickNameRef = useRef("");
  const passwordRef = useRef("");
  // console.log(auth.currentUser);
  const loginUser = auth.currentUser;

  const today = useSelector((state) => state.time);
  console.log("config", auth.currentUser);

  // console.log(userNick);
  // console.log("loginuser :", loginUser);
  // console.log(nickNameRef);

  const saveImgFile = async () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (finishedEvent) => {
      const imgDataUrl = finishedEvent.currentTarget.result;
      // localStorage.setItem("imgDataUrl", imgDataUrl);
      setImgFile(reader.result);
    };
    const storageRef = ref(
      storage,
      `/userProfile/${imgRef.current.files[0].name}`
    );
    // const imgDataUrl = localStorage.getItem("imgDataUrl");
    const uploadImg = await uploadBytes(storageRef, imgRef.current.files[0]);
    const imgUrl = await getDownloadURL(uploadImg.ref);
    console.log("ref:", uploadImg);
    console.log("uploadimg:", imgUrl);
    updateProfile(auth.currentUser, {
      photoURL: imgUrl,
    });
    await updateDoc(doc(db, "users", userDocId), {
      userImage: imgUrl,
    });
    setUserImage(imgUrl);
    // imgUrl.current = { url: imgUrl };
  };
  useEffect(() => {
    const q = query(collection(db, "users"));
    console.log("Q: ", q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const current = userList.find(
        (item) => item.userUid === auth.currentUser.uid
      );
      console.log("current:", current);
      setUserDocId(current.id);
    });
    // console.log("list: ", userList)
    // const ref = doc(db, "users", "userUid");
    // console.log("ref", ref);
  }, []);
  console.log(auth.currentUser);
  const profileChangeBtn = async (e) => {
    console.log(e);
    await updateProfile(auth.currentUser, {
      displayName: nickNameRef.current.value,
    });
    // setUserNick(displayName);
    // setUserNick(nickNameRef.current.value); // 닉네임 스테이트로 관리함  추가
    alert("닉네임이 변경되었습니다!");
    setUserNick(auth.currentUser.displayName); //state관리를 추가하니깐 갑자기 된다?
    // await updateProfile(doc(db, "users"));
    await updateDoc(doc(db, "users", userDocId), {
      userDisplayName: nickNameRef.current.value,
    });
  };
  // console.log("asd", userNick);
  // console.log("dd :", auth.currentUser);
  const passwordChangeBtn = async () => {
    const user = auth.currentUser;
    const newPassword = passwordRef.current.value;
    try {
      await updatePassword(user, newPassword);
      alert("변경완료");
    } catch {
      console.log(console.error());
    }
  };
  //유저 삭제
  const userDelete = async () => {
    const user = auth.currentUser;
    try {
      const userEmail = prompt("본인 이메일을 입력해주세요");
      if (userEmail === user.email) {
        await deleteUser(user);
        alert("그동안 SnackPang을 이용해주셔서 감사했습니다!!");
        navigate("/signin");
      } else {
        alert("이메일이 맞지 않습니다!");
      }
    } catch {
      alert("잘못된 접근입니다!");
    }
  };
  return (
    <>
      <div
        style={{
          backgroundColor: isDark ? "black" : "white",
          color: isDark ? "white" : "black",
        }}
      >
        <ProfileBox>
          <ProfileBoxDetail>
            <Label htmlFor="profile">
              <Profoleimg
                // src={
                //   loginUser.photoURL === null
                //     ? blankProfiles
                //     : loginUser.photoURL
                // }""  "ㅏ하ㅘㅘ"
                // src={!userImg ? loginUser?.photoURL : userImg}
                src={!userImage ? blankProfiles : userImage}
              />
              <ProfileInput
                ref={imgRef}
                accept="image/*"
                id="profile"
                type="file"
              />
            </Label>
            <ChangeImgBtn onClick={saveImgFile}>이미지 변경 저장</ChangeImgBtn>
            <h3>MY PROFILE</h3>
            <h3>닉네임</h3>
            <p>{loginUser?.displayName}</p>
            {/* <p>{userNick}</p> */}
            <div>
              <ProfileName
                ref={nickNameRef}
                placeholder={loginUser?.displayName}
                type="text"
              />
              <ProfileNameBtn onClick={profileChangeBtn}>변경</ProfileNameBtn>
            </div>
            <h3>패스워드 변경</h3>
            <div>
              <ProfileName
                ref={passwordRef}
                placeholder="password .."
                type="password"
              />
              <ProfileNameBtn onClick={passwordChangeBtn}>변경</ProfileNameBtn>
            </div>
            <UserDelteBox>
              <UserDelteBtn onClick={userDelete}>회원탈퇴</UserDelteBtn>
            </UserDelteBox>
          </ProfileBoxDetail>
        </ProfileBox>
      </div>
    </>
  );
}

export const UserDelteBox = styled.div`
  margin-top: 20px;
`;
export const UserDelteBtn = styled.div`
  border: 1px solid black;
  color: black;
  background-color: white;
  border-radius: 5px;
  padding: 2px;
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
    padding: 5px;
  }
`;

export const ChangeImgBtn = styled.button`
  background-color: white;
  border-radius: 5px;
  border: 1px solid black;
  transition: 0.5s;
  &:hover {
    background: #de4c2a;
    color: white;
    transition: 0.5s;
  }
  cursor: pointer;
`;
