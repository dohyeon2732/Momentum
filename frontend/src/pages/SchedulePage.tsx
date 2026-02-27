import  { useEffect, useState } from 'react';
import MobileTopBar from '../components/MobileTopBar';
import ComboBox from '../components/ComboBox';
import DateBack from '../assets/icons/DateBack.svg';
import DateFront from '../assets/icons/DateFront.svg';
import { useUserApi } from '../hooks/useUserApi';
import { useRoomApi } from '../hooks/useRoomApi';
import type { Schedule } from '../apis/type';


const DEPT_LIST = [
  { id: 1, name: '회장단' },
  { id: 2, name: '총운' },
  { id: 3, name: '재사' },
  { id: 4, name: '행기' },
  { id: 5, name: '문기' },
  { id: 6, name: '교정' },
  { id: 7, name: '인복' },
  { id: 8, name: '대협' },
  { id: 9, name: '홍소' },
  { id: 10, name: '디자인' },
];
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  const DATE_OPTIONS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const week = WEEK_DAYS[d.getDay()];

    return `${year}.${month}.${day} (${week})`;
  });
  

const SchedulePage = () => {
  const [userName, setUserName] = useState('');
  const [userKuk, setUserKuk] = useState('');
  const [roomList, setRoomList] = useState<
    { roomId: string; roomName: string }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: string;
    roomName: string;
  }>({ roomId: '', roomName: '' });


  const [today, setToday] = useState('');
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);

  const baseDate = new Date();
  const minDate = new Date(baseDate);
  minDate.setDate(baseDate.getDate() - 14);

  const maxDate = new Date(baseDate);
  maxDate.setDate(baseDate.getDate() + 14);

  const parseTodayToDate = () =>
  new Date(today.split(' ')[0].replaceAll('.', '-'));

const currentDate = parseTodayToDate();

  const isPrevHidden = currentDate<=minDate;
  const isNextHidden = currentDate>=maxDate;

  useEffect(() => {
    setToday(DATE_OPTIONS[0]);
  }, []);

  useEffect(() => {
    if(!selectedRoom.roomId || !today) return;
    const fetchSchedule = async () => {
      try {
        const res = await useRoomApi.searchRoomScheduleDate({
          roomId: Number(selectedRoom.roomId),
          scheduleDate: today.split(' ')[0].replaceAll('.', '-'),
        });
        setScheduleList(res.data);
      } catch (e) {
        console.error("can't find schedule list", e);
      }
    };
    fetchSchedule();
  }, [selectedRoom, today]);


  useEffect(() => {
    {
      const fetchMe = async () => {
        try {
          const res = await useUserApi.me();
          setUserName(res.data.userName);
          setUserKuk(res.data.kukName);
        } catch (e) {
          console.error('내 정보 조회 실패', e);
        }
      };
      fetchMe();
    }
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await useRoomApi.findAll();
        setRoomList(res.data);
        const defaultR = res.data.find(
          (room: { roomId: number }) => room.roomId === 1
        );
        if (defaultR) {
          setSelectedRoom(defaultR);
        }
      } catch (e) {
        console.error("can't find room list", e);
      }
    };
    fetchRoom();
  }, []);


  const timeSlot = Array.from({ length: 25 }, (_, hour) => {
    const reservation = scheduleList.find((item) => {
      const startHour = Number(item.startTime.split(':')[0]);
      const endHour = Number(item.endTime.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });

    if(!reservation) {
      return { time: hour, isReserved: false };
    }

    const kukInfo = DEPT_LIST.find((d) => d.id === reservation.kukId);

    return {
      time: hour,
      scheduleName: reservation.scheduleName,
      kuk: kukInfo ? kukInfo.name: '미지정',
      isReserved: true,
    };
  });


  return (
    <div className='w-[393px] flex flex-col items-center justify-center gap-4'>
      <MobileTopBar
        dept={userKuk}
        name={userName}
        title="회의 공간 사용 신청"
        back={true}
      />
      <div className="flex flex-row justify-center items-center gap-6">
        <p className="text-base font-semibold">사용 장소</p>
        <ComboBox
          value={selectedRoom.roomName}
          onChange={(v) => {
            const selected = roomList.find((room) => room.roomName === v);
            if (selected) setSelectedRoom(selected);
          }}
          width={64}
          placeholder="사용 가능 장소"
          name={roomList.map((k) => k.roomName)}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-50 flex flex-row justify-between items-center">
          <button
                    className={isPrevHidden?'invisible':''}

          onClick={()=>{
            const todayDate = new Date(today.split(' ')[0].replaceAll('.', '-'));
            todayDate.setDate(todayDate.getDate() - 1);
            const prevDay = `${todayDate.getFullYear()}.${String(todayDate.getMonth() + 1).padStart(2, '0')}.${String(todayDate.getDate()).padStart(2, '0')} (${WEEK_DAYS[todayDate.getDay()]})`;
            setToday(prevDay);
          }}>
            <img src={DateBack} />
          </button>
          <div className="w-40 flex items-center justify-center text-lg font-semibold">
            {today}
          </div>
          <button 
          className={isNextHidden?'invisible':''}
          onClick={() => {
            const todayDate = new Date(today.split(' ')[0].replaceAll('.', '-'));
            todayDate.setDate(todayDate.getDate() + 1);
            const nextDay = `${todayDate.getFullYear()}.${String(todayDate.getMonth() + 1).padStart(2, '0')}.${String(todayDate.getDate()).padStart(2, '0')} (${WEEK_DAYS[todayDate.getDay()]})`;
            setToday(nextDay);
          }}>
            <img src={DateFront} />
          </button>
        </div>
        <div className="w-[352px] p-4 bg-[#fafafa] rounded-lg -space-y-2">
          {timeSlot.map((slot) => (
            <div className="flex flex-col items-end -space-y-2" key={slot.time}>
              {/* 시간 선 */}
              <div className="flex flex-row items-center justify-center gap-2 ">
                <p className="text-zinc-500 text-xs, font-semibold w-10 flex items-center justify-center">
                  {slot.time}시
                </p>
                <div className="w-[270px] h-[1px] bg-zinc-500"></div>
              </div>
              {/* 일정 블럭 */}
              <div
                className={`flex flex-row gap-1.5 justify-center text-[#373737] items-center w-[270px] h-9 px-1 py-2 ${slot.kuk === '회장단' ? 'bg-[#a0a0a0] text-white' : slot.kuk === '총운' ? 'bg-[#FFA9A9]' : slot.kuk === '재사' ? 'bg-[#FFB298]' : slot.kuk === '행기' ? 'bg-[#FFF189]' : slot.kuk === '문기' ? 'bg-[#B3DE9A]' : slot.kuk === '교정' ? 'bg-[#84C9C0]' : slot.kuk === '인복' ? 'bg-[#86DBFF]' : slot.kuk === '대협' ? 'bg-[#A6C2F2]' : slot.kuk === '홍소' ? 'bg-[#B397FF]' : slot.kuk === '디자인' ? 'bg-[#FFA1DE]' : 'bg-zinc-300'} rounded-lg ${slot.isReserved ? '' : 'invisible'} `}
              >
                <p className="flex justify-center items-center text-sm font-bold w-16">
                  {slot.kuk}
                </p>
                <div
                  className={`w-[1px] h-4 ${slot.kuk === '회장단' ? 'bg-white' : 'bg-black'}`}
                ></div>
                <p className="flex justify-center items-center text-sm font-medium w-45">
                  {slot.scheduleName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
