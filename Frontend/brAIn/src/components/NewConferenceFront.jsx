import Button from "../components/Button/Button"; // Import custom Button
import IconButton from '@mui/material/IconButton'; // MUI IconButton import
import AddIcon from '@mui/icons-material/Add'; // MUI AddIcon import

const JoinConferenceFront = ({ handleJoinConferenceTrue }) => {
  return (
    <div
      className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl backface-hidden z-[2] shadow-xl cursor-pointer"
      onClick={handleJoinConferenceTrue}
    >
      <img
        src='images/NewConference.png'
        alt="회의 시작 배너 이미지"
        className="w-full h-60 object-cover object-center"
      />
      <div className="w-full flex grow flex-col p-6 justify-between">
        <div>
          <h3 className="semibold-32 break-keep mb-1">회의 참여하기</h3>
          <p className="medium-16 text-grayscale-darkgray break-keep">
            생성된 회의 세션에 참여해 보세요. 실시간 채팅으로 세션 진행자에게 질문하고 다양한 사람들과 소통할 수 있어요.
          </p>
        </div>
        <Button
          type="full" // Adjust as needed
          buttonStyle="blue" // Example button style, adjust as needed
          onClick={handleJoinConferenceTrue}
          startIcon={<AddIcon />}
        >
          회의 참여하기
        </Button>
      </div>
    </div>
  );
};

export default JoinConferenceFront;
