import { useEffect, useState } from 'react';
import ComboBox from '../components/ComboBox';
import MobileTopBar from '../components/MobileTopBar';
import PopUpCard from '../components/PopUpCard';
import BottomButton3 from '../components/button/BottomButton3';
import { useRoomApi } from '../hooks/useRoomApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScheduleApi } from '../hooks/useScheduleApi';
import { useUserApi } from '../hooks/useUserApi';



const Edit = () => {
  const navigate = useNavigate();
  const [popup1, setPopup1] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);
  const [popup4, setPopup4] = useState(false);
  const [popup5, setPopup5] = useState(false);
  const [popup6, setPopup6] = useState(false);
  const [duty, setDuty] = useState('');
  const [people, setPeople] = useState(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [userName, setUserName] = useState('');
  const [userKuk, setUserKuk] = useState('');

  const [roomList, setRoomList] = useState<
    { roomId: string; roomName: string }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: string;
    roomName: string;
  }>({ roomId: '', roomName: '' });

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

const location = useLocation();
const {schedule} = location.state || {};

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

const cancelHandle = () =>{
  setPopup1(false);
  navigate('/home');
}

const deleteHandle = async () => {
  setPopup2(false);
  const res= await useScheduleApi.delete(schedule.scheduleId);
  if(res.status === 200){
    setPopup4(true);
  }
}

const editHandle = async () => {
  try{
    setPopup3(false);
  const res = await useScheduleApi.edit({
    scheduleId: schedule.scheduleId,
    scheduleName: duty,
    scheduleDescription: duty,
    roomId: Number(selectedRoom.roomId),
    userId: schedule.userId,
    scheduleDate: date.slice(0, 10).replaceAll('.', '-'),
    startTime: String(startTime.slice(0, 2)).padStart(2, '0') + ':00',
    endTime: String(endTime.slice(0, 2)).padStart(2, '0') + ':00',
    schedulePeople: people,
  });

  if(res.status === 200){
    setPopup5(true);
  }
  }catch(e){
    console.error('수정 실패', e);
    setPopup3(false);
    setPopup6(true);
  }
}

const popupHandle = () =>{
  navigate('/home');
}

useEffect(()=>{
  if(!schedule) return;

  if(schedule.scheduleName){
    setDuty(schedule.scheduleName);
  }

  if(typeof schedule.schedulePeople === 'number'){
    setPeople(schedule.schedulePeople);
  }

  if(schedule.roomId && schedule.roomName){
    setSelectedRoom({roomId: schedule.roomId, roomName: schedule.roomName});
  }

  if(schedule.scheduleDate){
    const d=new Date(schedule.scheduleDate);
    const year=d.getFullYear();
    const month=String(d.getMonth()+1).padStart(2,'0');
    const day=String(d.getDate()).padStart(2,'0');
    const week=WEEK_DAYS[d.getDay()];

    setDate(`${year}.${month}.${day} (${week})`);
  }

  if(schedule.startTime){
    const startHour = schedule.startTime.slice(0, 2);
    setStartTime(`${startHour}시`);
  }
  
  if(schedule.endTime){ 
    const endHour = schedule.endTime.slice(0, 2);
    setEndTime(`${endHour}시`);
  }

},[])

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
            onChange={(e) => setDuty(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">사용 인원</p>
          <input
            className="w-64 py-2 px-3 rounded bg-zinc-100 text-left"
            type="number"
            placeholder="사용 인원 입력"
            value = {people}
            onChange={(e) => setPeople(Number(e.target.value))}
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
      <BottomButton3
        text1={'취소하기'}
        color1={'gray'}
        onClick1={() => setPopup1(true)}
        text2={'삭제하기'}
        color2={'red'}
        onClick2={() => setPopup2(true)}
        text3={'수정하기'}
        color3={'blue'}
        onClick3={() => setPopup3(true)}
      />

      <PopUpCard
        isOpen={popup1}
        onRequestClose={() => setPopup1(false)}
        title={'취소하기'}
        descript={'수정한 스케줄은 저장되지 않습니다.'}
        input={false}
        placeholder=""
        first="계속 신청하기"
        second="취소하기"
        onFirstClick={() => setPopup1(false)}
        onSecondClick={() => {cancelHandle()}}
      />

      <PopUpCard
        isOpen={popup2}
        onRequestClose={() => setPopup2(false)}
        title={'스케줄 삭제하기'}
        descript={'해당 예약 건을 정말 삭제하시겠습니까?'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="삭제하기"
        secondcolor="red"
        onFirstClick={() => setPopup2(false)}
        onSecondClick={() => {deleteHandle()}}
      />

      <PopUpCard
        isOpen={popup3}
        onRequestClose={() => setPopup3(false)}
        title={'사용 신청 수정하기'}
        descript={'해당 스케줄로 수정하시겠습니까?'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="수정하기"
        onFirstClick={() => setPopup3(false)}
        onSecondClick={() => {editHandle()}}
      />

      <PopUpCard
        isOpen={popup4}
        onRequestClose={() => setPopup4(false)}
        title={'삭제 완료'}
        descript={'해당 스케줄이 삭제되었습니다.'}
        input={false}
        placeholder=""
        first="확인"
        onFirstClick={() => {setPopup4(false) ; popupHandle() ;}}
      />

      <PopUpCard
        isOpen={popup5}
        onRequestClose={() => setPopup5(false)}
        title={'수정 완료'}
        descript={'해당 스케줄이 수정되었습니다.'}
        input={false}
        placeholder=""
        first="확인"
        onFirstClick={() => {setPopup5(false) ; popupHandle() ;}}
      />

      <PopUpCard
        isOpen={popup6}
        onRequestClose={() => setPopup6(false)}
        title={'시간 오류'}
        descript={'시간이 중복되는 등 오류가 있습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup6(false)}
      />
    </div>
  );
};

export default Edit;
