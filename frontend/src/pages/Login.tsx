import { useState, useEffect } from 'react';
import BlueButton from '../components/button/BlueButton';
import ComboBox from '../components/ComboBox';
import { useNavigate } from 'react-router-dom';
import { useUserApi } from '../hooks/useUserApi';
import { useKukApi } from '../hooks/useKukApi';
import PopUpCard from '../components/PopUpCard';

const Login = () => {
  const navigate = useNavigate();

  const [popup1,setPopup1] = useState(false);
  const [kukList, setKukList] = useState<{ id: number; kukName: string }[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [kuk, setKuk] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchKukList = async () => {
      try {
        const res = await useKukApi.findAll();
        setKukList(
          res.data.map((k: { kukId: number; kukName: string }) => ({
            id: k.kukId,
            kukName: k.kukName,
          }))
          
        );
      } catch (e) {
        console.error('kuk list empty', e);
      }
    };
    fetchKukList();
  }, []);


  useEffect(() => {
    if (!kuk) {
      setUserList([]);
      setName('');
      return;
    }

    const fetchUsersByKuk = async () => {
      try {
        const selectedKuk = kukList.find((k) => k.kukName === kuk);
        if (!selectedKuk) return;

        const res = await useUserApi.findByKuk({ kukId: selectedKuk.id });
        setUserList(res.data.map((u: { userName: string }) => u.userName));
        console.log('user list', res.data);
      } catch (e) {
        console.error('user list load fail', e);
      }
    };
    fetchUsersByKuk();
  }, [kuk]);

  const handleLogin = async () => {
    try {
      const res = await useUserApi.login({
        kukName: kuk,
        userName: name,
        password: password,
      });

      const { accessToken } = res.data;

      if (!accessToken) {
        throw new Error('accessToken이 없습니다.');
      }

      localStorage.setItem('accessToken', accessToken);

      navigate('/home');
    } catch (e) {
      console.error('login fail', e);
      setPopup1(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div>
        <p className="text-2xl text-center font-semibold">총학생회 모멘텀</p>
        <p className="text-3xl text-center font-bold">회의 공간 사용 신청</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            소속 국
          </p>
          <ComboBox
            placeholder="국을 선택하세요."
            name={kukList.map((k) => k.kukName)}
            value={kuk}
            onChange={setKuk}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            이름
          </p>
          <ComboBox
            placeholder="이름을 선택하세요."
            name={userList}
            value={name}
            onChange={setName}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            비밀번호
          </p>
          <input
            className="w-64 h-12 p-3 bg-zinc-100 rounded-lg"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
      <BlueButton text="로그인" color="blue" onClick={handleLogin} />
      
      <PopUpCard
        isOpen={popup1}
        onRequestClose={() => setPopup1(false)}
        title={'로그인 실패'}
        descript={'로그인 정보가 올바르지 않습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup1(false)}
      />
    </div>
  );
};
export default Login;
