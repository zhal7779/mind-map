import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState, isOpenAuthModal } from '../../../recoil/atoms/auth';
import BaseModal from '../BaseModal';
import styled from 'styled-components';
import React, { useState } from 'react';
import { alert } from '../../../utils/alert';
import * as S from '../../../styles/modal';
import { postJoin, postLogin, postDuplicateId } from '../../../api/auth';
import { setAccessToken } from '../../../utils/auth';
import { passwordRegex } from '../../../data/regex';

const AuthModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenAuthModal);
  const setAuth = useSetRecoilState(authState);

  const [step, setStep] = useState('login'); // login => 로그인 화면, join-id => 회원가입 아이디 화면, join-pw =>회원가입 비밀번호 화면

  const [loginInput, setLoginInput] = useState({
    id: '',
    password: '',
  });

  const [joinInput, setJoinInput] = useState({
    id: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });

  const [isValid, setIsValid] = useState({
    id: false,
    password: false,
  });

  const handleActiveTrial = async () => {
    const testID = import.meta.env.VITE_TEST_ID;
    const testPW = import.meta.env.VITE_TEST_PASSWORD;

    const response = await postLogin({
      id: testID,
      password: testPW,
    });
    if (response.success) {
      setAccessToken(response.data);
      setAuth(true);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
  };

  const onChangeLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setLoginInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const onChangeJoinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setJoinInput((prevInput) => ({ ...prevInput, [name]: value }));

    if (name === 'password') {
      //비밀번호 유효성 검사
      if (passwordRegex.test(value)) {
        setIsValid((prevValid) => ({ ...prevValid, password: true }));
      } else {
        setIsValid((prevValid) => ({ ...prevValid, password: false }));
      }
    }
  };

  const handleLogin = async () => {
    const response = await postLogin(loginInput);
    if (response.success) {
      setAccessToken(response.data);
      setAuth(true);
      setIsOpen(false);
    }
  };

  const handleCheckDuplicateId = async () => {
    if (!joinInput.id.length) return alert('아이디를 입력해 주세요', 'warning');

    setIsValid((prevValid) => ({ ...prevValid, id: false }));

    const response = await postDuplicateId(joinInput.id);

    if (response.code === 200) {
      alert('사용 가능한 아이디입니다', 'success');
      return setIsValid((prevValid) => ({ ...prevValid, id: true }));
    }
  };

  const handleNextJoin = () => {
    if (!joinInput.id.length) {
      alert('아이디를 입력해 주세요', 'warning');
    } else if (!isValid.id) {
      alert('아이디를 중복 체크해 주세요', 'warning');
    } else if (!joinInput.name.length) {
      alert('닉네임을 입력해주세요', 'warning');
    } else {
      setStep('join-pw');
    }
  };

  const handleCompleteJoin = async () => {
    if (!joinInput.password.length) {
      return alert('비밀번호를 입력해주세요', 'warning');
    } else if (!isValid.password) {
      return alert('비밀번호 형식이 올바르지 않습니다.', 'warning');
    } else if (joinInput.password !== joinInput.passwordConfirm) {
      return alert('비밀번호를 재확인해주세요', 'warning');
    }
    const response = await postJoin({
      id: joinInput.id,
      name: joinInput.name,
      password: joinInput.password,
    });

    if (response.success) {
      alert('회원가입이 완료되었습니다', 'success');
      setStep('login');
      setJoinInput({
        id: '',
        name: '',
        password: '',
        passwordConfirm: '',
      });
    }
  };

  const LoginContent = (
    <S.ModalContent>
      <S.ModalTitle>로그인</S.ModalTitle>
      <S.InputContent>
        <span>아이디</span>
        <S.Input
          type="text"
          name="id"
          value={loginInput.id}
          placeholder="아이디를 입력해주세요"
          onChange={onChangeLoginInput}
        />
      </S.InputContent>
      <S.InputContent>
        <span>비밀번호</span>
        <S.Input
          placeholder="비밀번호를 입력해주세요"
          type="password"
          name="password"
          value={loginInput.password}
          onChange={onChangeLoginInput}
        />
        <TextButton>아이디 찾기</TextButton>
      </S.InputContent>
      <S.ButtonWrapper>
        <S.LoginButton onClick={handleLogin}>로그인</S.LoginButton>
        <S.TrialLoginButton onClick={handleActiveTrial}>
          체험판 로그인
        </S.TrialLoginButton>
      </S.ButtonWrapper>
      <BottomContent>
        <span>계정이 없으신가요?</span>
        <TextButton
          onClick={() => {
            setStep('join-id');
          }}
        >
          회원가입
        </TextButton>
      </BottomContent>
    </S.ModalContent>
  );

  const JoinContent = (
    <S.ModalContent>
      <S.ModalTitle>회원가입</S.ModalTitle>
      {step === 'join-id' ? (
        <>
          <S.InputContent>
            <span>아이디</span>
            <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
              <S.Input
                placeholder="아이디를 입력해주세요"
                name="id"
                value={joinInput.id}
                onChange={onChangeJoinInput}
              />
              <S.ConfirmButton onClick={handleCheckDuplicateId}>
                중복확인
              </S.ConfirmButton>
            </div>
          </S.InputContent>
          <S.InputContent>
            <span>닉네임</span>
            <S.Input
              placeholder="닉네임을 입력해주세요"
              name="name"
              value={joinInput.name}
              onChange={onChangeJoinInput}
            />
          </S.InputContent>
          <S.LoginButton onClick={handleNextJoin}>계속</S.LoginButton>
        </>
      ) : step === 'join-pw' ? (
        <>
          <S.InputContent>
            <span>비밀번호</span>
            <S.Input
              placeholder="비밀번호는 영문 + 숫자 + 특수문자를 조합해주세요"
              type="password"
              value={joinInput.password}
              name="password"
              onChange={onChangeJoinInput}
            />
            <S.DuplicateText $isDuplicate={isValid.password}>
              영문+숫자+특수문자
            </S.DuplicateText>
          </S.InputContent>
          <S.InputContent>
            <span>비밀번호 재확인</span>
            <S.Input
              placeholder="비밀번호를 재확인해주세요"
              type="password"
              value={joinInput.passwordConfirm}
              name="passwordConfirm"
              onChange={onChangeJoinInput}
            />
            <S.DuplicateText
              $isDuplicate={
                joinInput.password === joinInput.passwordConfirm &&
                isValid.password
              }
            >
              비밀번호 재확인 일치
            </S.DuplicateText>
          </S.InputContent>
          <S.ButtonWrapper>
            <S.TrialLoginButton onClick={() => setStep('join-id')}>
              이전으로
            </S.TrialLoginButton>
            <S.LoginButton onClick={handleCompleteJoin}>완료</S.LoginButton>
          </S.ButtonWrapper>
        </>
      ) : (
        <></>
      )}
      <BottomContent>
        <span>이미 계정이 있으신가요?</span>
        <TextButton
          onClick={() => {
            setStep('login');
          }}
        >
          로그인하러 가기
        </TextButton>
      </BottomContent>
    </S.ModalContent>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={handleDelete}>
      <img src="/img/logo.png" alt="logo" style={{ width: '12rem' }} />
      {step === 'login' ? LoginContent : JoinContent}
    </BaseModal>
  );
};

export default AuthModal;

const TextButton = styled.button`
  font-size: 1.3rem;
  text-decoration: underline;
  color: var(--color-purple);
  background-color: transparent;
`;

const BottomContent = styled.div`
  font-size: 1.3rem;
  padding: 2rem;
  margin-bottom: 3rem;
`;
