import  { useEffect, useState } from 'react';
import MobileTopBar from '../components/MobileTopBar';
import BottomButton from '../components/button/BottomButton';
import { useUserApi } from '../hooks/useUserApi';
import type { Schedule } from '../apis/type';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<Schedule[]>([]);
  const [past, setPast] = useState<Schedule[]>([]);

  const getDayOfWeek = (dateStr: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };
  const formatDateTime = (s: Schedule) => {
    const day = getDayOfWeek(s.scheduleDate);
    return `${s.scheduleDate.replaceAll('-', '.')} (${day}) ${s.startTime.slice(0, 5)} ~ ${s.endTime.slice(0, 5)}`;
  };

  const [userName, setUserName] = useState('');
  const [userKuk, setUserKuk] = useState('');
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    {
      const fetchMe = async () => {
        try {
          const res = await useUserApi.me();
          setUserName(res.data.userName);
          setUserKuk(res.data.kukName);
          setUserId(res.data.userId);
        } catch (e) {
          console.error('내 정보 조회 실패', e);
        }
      };
      fetchMe();
    }
  }, []);

  useEffect(() => {
    {
      const fetchSchedule = async () => {
        try {
          const res1 = await useUserApi.scheduleUpcoming({ userId });
          setUpcoming(res1.data);
          const res2 = await useUserApi.schedulePast({ userId });
          setPast(res2.data);
        } catch (e) {
          console.error('예약 내역 조회 불가', e);
        }
      };
      fetchSchedule();
    }
  }, [userId]);

  return (
    <div>
      <MobileTopBar
      buttonOn={true}
        dept={userKuk}
        name={userName}
        title="회의 공간 사용 신청"
        back={false}
      />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">내가 신청한 내역</p>
          {upcoming.map((s) => (
            <div
              key={s.scheduleId}
              className="flex flex-row justify-between items-center w-88.25 px-4 py-3 bg-zinc-100 rounded-lg gap-3.5"
            >
              <div className="flex flex-col">
                <p className="text-xl font-semibold w-62 whitespace-normal break-words">{s.scheduleName}</p>
                <p className="text-base font-medium">{s.roomName}</p>
                <p className="text-base font-medium">{formatDateTime(s)}</p>
              </div>
              <button className="w-15 h-8.5 flex items-center justify-center bg-[#86A6FF] rounded-lg" onClick={()=>navigate('/edit',{state:{
               schedule:s,
              },})}>
                <p className="text-white text-base font-bold">수정</p>
              </button>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="flex justify-center items-center text-zinc-400">
              신청한 내역이 없습니다.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">사용 완료된 내역</p>
          {past.map((s) => (
            <div
              key={s.scheduleId}
              className="flex flex-row justify-between items-center w-88.25 px-4 py-3 bg-zinc-100  rounded-lg gap-3.5"
            >
              <div className="flex flex-col">
                <p className="text-xl font-semibold w-62 whitespace-normal break-words">{s.scheduleName}</p>
                <p className="text-base font-medium">{s.roomName}</p>
                <p className="text-base font-medium">{formatDateTime(s)}</p>
              </div>
            </div>
          ))}
          {past.length === 0 && (
            <p className="flex justify-center items-center text-zinc-400">
              신청한 내역이 없습니다.
            </p>
          )}
          {}
        </div>
      </div>

      <BottomButton
        text1="스케줄 조회"
        color1="lightblue"
        onClick1={() => navigate('/schedule')}
        text2="사용 신청"
        color2="blue"
        onClick2={() => navigate('/apply')}
      />
    </div>
  );
};

export default Home;
