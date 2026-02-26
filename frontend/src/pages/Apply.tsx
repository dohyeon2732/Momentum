import { useEffect, useState } from 'react';
import BottomButton from '../components/button/BottomButton';
import ComboBox from '../components/ComboBox';
import MobileTopBar from '../components/MobileTopBar';
import PopUpCard from '../components/PopUpCard';
import { useUserApi } from '../hooks/useUserApi';
import { useRoomApi } from '../hooks/useRoomApi';
import { useNavigate } from 'react-router-dom';
import { useScheduleApi } from '../hooks/useScheduleApi';

const Apply = () => {
  const navigate = useNavigate();
  const [popup1, setPopup1] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);
  const [popup4, setPopup4] = useState(false);

  const [userName, setUserName] = useState('');
  const [userKuk, setUserKuk] = useState('');
  const [userId, setUserId] = useState(0);
  const [roomList, setRoomList] = useState<
    { roomId: string; roomName: string }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: string;
    roomName: string;
  }>({ roomId: '', roomName: '' });

  const [duty, setDuty] = useState('');
  const [people, setPeople] = useState(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  const TIME_OPTIONS = Array.from(
    { length: 25 },
    (_, i) => String(i).padStart(2, '0') + '시',
  );

  const DATE_OPTIONS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const week = WEEK_DAYS[d.getDay()];

    return `${year}.${month}.${day} (${week})`;
  });

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
    const fetchRoom = async () => {
      try {
        const res = await useRoomApi.findAll();
        setRoomList(res.data);
      } catch (e) {
        console.error("can't find room list", e);
      }
    };
    fetchRoom();
  }, []);

  const handleApply = async () => {
    try {
      if (
        !selectedRoom.roomId ||
        !duty ||
        !people ||
        !date ||
        !startTime ||
        !endTime
      ) {
        setPopup1(false);
        setPopup3(true);
        return;
      }
      const res = await useScheduleApi.create({
        scheduleName: duty,
        scheduleDescription: duty,
        roomId: Number(selectedRoom.roomId),
        userId: userId,
        scheduleDate: String(date).slice(0, 10).replaceAll('.', '-'),
        startTime: String(startTime).replace('시', '') + ':00',
        endTime: String(endTime).replace('시', '') + ':00',
        schedulePeople: people,
      });

      

      setDuty('');
      setPeople(0);
      setDate('');
      setStartTime('');
      setEndTime('');
      setSelectedRoom({ roomId: '', roomName: '' });
      
      if (res.status === 200 || res.status === 201) {
        navigate('/home');
      }
    } catch (e) {
      console.error('신청 실패', e);
      setPopup1(false)
      setPopup4(true);
    }
  };

  return (
    <div>
      <MobileTopBar
        dept={userKuk}
        name={userName}
        title="회의 공간 사용 신청"
        back={true}
      />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 장소</p>
          <ComboBox
            value={selectedRoom.roomName}
            onChange={(v) => {
              const selected = roomList.find((room) => room.roomName === v);
              if (selected) setSelectedRoom(selected);
            }}
            width={64}
            placeholder={'사용 장소 입력'}
            name={roomList.map((k) => k.roomName)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 목적</p>
          <input
            className="w-64 py-2 px-3 rounded bg-zinc-100 text-left"
            type="text"
            placeholder="사용 목적 입력"
            value={duty}
            onChange={(v) => setDuty(v.target.value)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 인원</p>
          <input
            className="w-64 py-2 px-3 rounded bg-zinc-100 text-left"
            type="number"
            placeholder="사용 인원 입력"
            value={people}
            onChange={(v) => setPeople(Number(v.target.value))}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 일자</p>
          <ComboBox
            width={64}
            placeholder={'사용 일자 선택'}
            name={DATE_OPTIONS}
            value={date}
            onChange={(v) => setDate(v)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 시간</p>
          <div className="flex flex-row gap-5.5">
            <ComboBox
              width={24.5}
              placeholder={'시작'}
              name={TIME_OPTIONS}
              value={startTime}
              onChange={(v) => {
                setStartTime(v);
                if (
                  endTime &&
                  TIME_OPTIONS.indexOf(endTime) <= TIME_OPTIONS.indexOf(v)
                ) {
                  setEndTime('');
                } 
              }}
            />
            <p className="text-2xl font-bold">~</p>
            <ComboBox
              width={24.5}
              placeholder={'종료'}
              name={
                startTime
                  ? TIME_OPTIONS.slice(TIME_OPTIONS.indexOf(startTime) + 1)
                  : TIME_OPTIONS
              }
              value={endTime}
              onChange={(v) => {
                setEndTime(v);
                          }}  
            />
          </div>
        </div>
      </div>
      <BottomButton
        text1={'취소하기'}
        color1={'gray'}
        onClick1={() => setPopup2(true)}
        text2={'사용 신청하기'}
        color2={'blue'}
        onClick2={() => setPopup1(true)}
      />

      <PopUpCard
        isOpen={popup1}
        onRequestClose={() => setPopup1(false)}
        title={'사용 신청하기'}
        descript={'해당 스케줄로 사용 신청하시겠습니까?'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="신청하기"
        onFirstClick={() => setPopup1(false)}
        onSecondClick={() => {
          handleApply();
        }}
      />

      <PopUpCard
        isOpen={popup2}
        onRequestClose={() => setPopup2(false)}
        title={'취소하기'}
        descript={'현재까지 작성한 내용은 저장되지 않습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="취소하기"
        onFirstClick={() => setPopup2(false)}
        onSecondClick={() => {
          navigate('/home');
          setDuty('');
          setPeople(0);
          setDate('');
          setStartTime('');
          setEndTime('');
        }}
      />
      <PopUpCard
        isOpen={popup3}
        onRequestClose={() => setPopup3(false)}
        title={'입력 오류'}
        descript={'모든 항목을 입력해주세요.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup3(false)}
      />

      <PopUpCard
        isOpen={popup4}
        onRequestClose={() => setPopup4(false)}
        title={'시간 오류'}
        descript={'시간이 중복되는 등 오류가 있습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup4(false)}
      />
    </div>
  );
};

export default Apply;
