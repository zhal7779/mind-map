import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState, isOpenAuthModal } from '../../../recoil/atoms/auth';
import BaseModal from '../BaseModal';
import styled from 'styled-components';
import { useState } from 'react';
import { alert } from '../../../utils/alert';
import * as S from '../../../styles/modal';
const AuthModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenAuthModal);
  const setAuth = useSetRecoilState(authState);
  const [step, setStep] = useState('login'); // login => 로그인 화면, join-id => 회원가입 아이디 화면, join-pw =>회원가입 비밀번호 화면
  const handleActiveTrial = () => {
    setAuth(true);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setIsOpen(false);
  };

  const handleCompleteJoin = () => {
    alert('회원가입이 완료되었습니다', 'success');
    setStep('login');
  };

  const LoginContent = (
    <S.ModalContent>
      <S.ModalTitle>로그인</S.ModalTitle>
      <S.InputContent>
        <span>아이디</span>
        <S.Input placeholder="아이디를 입력해주세요" />
      </S.InputContent>
      <S.InputContent>
        <span>비밀번호</span>
        <S.Input placeholder="비밀번호를 입력해주세요" type="password" />
        <TextButton>비밀번호 찾기</TextButton>
      </S.InputContent>
      <S.ButtonWrapper>
        <S.LoginButton>로그인</S.LoginButton>
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
            <span>닉네임</span>
            <S.Input placeholder="닉네임을 입력해주세요" />
          </S.InputContent>
          <S.InputContent>
            <span>아이디</span>
            <S.Input placeholder="아이디를 입력해주세요" />
          </S.InputContent>

          <S.LoginButton onClick={() => setStep('join-pw')}>계속</S.LoginButton>
        </>
      ) : step === 'join-pw' ? (
        <>
          <S.InputContent>
            <span>비밀번호</span>
            <S.Input placeholder="비밀번호를 입력해주세요" type="password" />
          </S.InputContent>
          <S.InputContent>
            <span>비밀번호 재확인</span>
            <S.Input placeholder="비밀번호를 재확인해주세요" type="password" />
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
      <img src="/public/img/logo.png" alt="logo" style={{ width: '12rem' }} />
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
