import { instance } from '../instance';

//회원가입
const postJoin = async (payload: {
  id: string;
  name: string;
  password: string;
}) => {
  const { data } = await instance.post('/api/auth/', payload);
  return data;
};

//로그인
const postLogin = async (payload: { id: string; password: string }) => {
  const { data } = await instance.post('/api/auth/login', payload);

  return data;
};
//로그아웃
const postLogout = async () => {
  const { data } = await instance.post('/api/auth/logout');

  return data;
};

export { postJoin, postLogin, postLogout };
