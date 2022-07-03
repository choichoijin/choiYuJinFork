import React, { useEffect, useState } from "react";
import {
  Cards,
  WriterInfo,
  EditButton,
  PasswordModal,
  Hint,
  Notice,
  ButtonContainer,
} from "./style";
import { api } from "api.js";
import { useNavigate } from "react-router";

function LetterCards() {
  const [letterData, setLetterData] = useState([]);
  const [typedPassword, setTypedPassword] = useState();

  //modalOpen이 true면 모달을 열어라.
  const [modalOpen, setModalOpen] = useState(false);

  //비밀번호 맞춰진 편지 list.
  const [unlockList, setUnlockList] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState();

  //서버에서 데이터 받아 letterData에 저장.
  useEffect(() => {
    const getLetterData = async () => {
      try {
        const response = await api.get("/letter");
        setLetterData(response.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    getLetterData();
  }, []);

  //편지 카드 보여주기.
  const letterList = letterData.map((letter) => (
    <li key={letter._id} onClick={() => showModal(letter)}>
      {unlockList.indexOf(letter._id) === -1 ? (
        "🔐"
      ) : (
        <article>
          <div>
            <WriterInfo>
              <span>From. {letter.name}</span>
              {letter.images.map((url) => (
                <img key={url} alt="이미지" src={url} />
              ))}
            </WriterInfo>
            <p>{letter.content}</p>
          </div>
          <EditButton onClick={() => handleEditBtn(letter)}>
            내맘대로 수정하기
          </EditButton>
        </article>
      )}
    </li>
  ));

  const navigate = useNavigate();
  function handleEditBtn(letter) {
    navigate("/edit", { state: letter });
  }

  //선택된 편지 정보 저장 & 모달에 보여주기
  function showModal(letter) {
    setWrongPassword(false);
    setModalOpen(true);
    setSelectedLetter(letter);
  }

  const onInputChange = (e) => {
    setTypedPassword(e.target.value);
  };

  const [wrongPassword, setWrongPassword] = useState(false);
  function checkPassword() {
    //비밀번호 맞음 -> 내용 보여줌.
    if (selectedLetter.password === typedPassword) {
      setWrongPassword(false);
      setModalOpen(false);
      setUnlockList((unlockList) => [...unlockList, selectedLetter._id]);
    } else {
      //틀림 -> 틀렸음.
      setWrongPassword(true);
    }
  }

  return (
    <>
      <Cards>
        <ul>{letterList}</ul>
      </Cards>
      {modalOpen ? (
        <PasswordModal>
          <h1>비밀번호를 입력해주세요.</h1>
          <Hint>힌트: {selectedLetter.hint}</Hint>
          <input placeholder="비밀번호" onChange={onInputChange}></input>
          {wrongPassword && <Notice>비밀번호가 틀렸어요!</Notice>}
          <ButtonContainer>
            <button onClick={checkPassword}>OK</button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </ButtonContainer>
        </PasswordModal>
      ) : null}
    </>
  );
}

export default LetterCards;
