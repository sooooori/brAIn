import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/Button/Button";
import SmallButton from "@/components/SmallButton/SmallButton";
import CloseIcon from "@/assets/svgs/close.svg?react";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import SearchIcon from "@/assets/svgs/search.svg?react";
import ConferenceCodeInput from "./ConferenceCodeInput"; // 수정된 컴포넌트 이름
import { useToast } from "@/components/Toast/useToast";

interface JoinConferenceBackProps {
  handleJoinConferenceFalse: () => void; // 수정된 핸들러 이름
  isConferenceSearchClicked: boolean; // 수정된 상태 변수
  handleConferenceSearchClickedTrue: () => void; // 수정된 핸들러 이름
  codeInputs: string[];
  setCodeInputs: React.Dispatch<React.SetStateAction<string[]>>;
}

const JoinConferenceBack = ({
  handleJoinConferenceFalse, // 수정된 핸들러
  isConferenceSearchClicked, // 수정된 상태 변수
  handleConferenceSearchClickedTrue, // 수정된 핸들러
  codeInputs,
  setCodeInputs
}: JoinConferenceBackProps) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSearchButtonClicked = () => {
    if (isConferenceSearchClicked) navigate(`/participant?roomid=${codeInputs.join("")}`);
    else {
      if (codeInputs.join("").length !== 6) showToast({ message: "회의 코드를 올바르게 입력해주세요.", type: "alert" });
      else {
        axios
          .get(`${import.meta.env.VITE_API_SERVER_URL}/conference?code=${codeInputs.join("")}`) // 수정된 API URL
          .then((result) => {
            setTitle(result.data.title);
            setDescription(result.data.description);
            handleConferenceSearchClickedTrue(); // 수정된 핸들러
          })
          .catch(() => {
            showToast({ message: "회의 코드가 존재하지 않아요.", type: "alert" });
          });
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl rotate-180 z-[1] shadow-xl">
      <div className="w-full h-full flex flex-col p-6 gap-6">
        <div className="flex flex-row justify-between">
          <h3 className="semibold-32 break-keep">회의 참여하기</h3>
          <SmallButton onClick={handleJoinConferenceFalse}> {/* 수정된 핸들러 */}
            <CloseIcon className="w-6 h-6" />
          </SmallButton>
        </div>

        {isConferenceSearchClicked ? ( // 수정된 상태 변수
          <>
            <div className="flex flex-col gap-1">
              <h4 className="semibold-18 break-keep">회의 코드</h4>
              <p className="medium-32 text-boarlog-100 break-keep">{codeInputs.join("")}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="semibold-18 break-keep">회의 제목</h4>
              <p className="medium-16 text-grayscale-darkgray break-keep">{title}</p>
            </div>

            <div className="flex flex-col flex-grow gap-2">
              <h4 className="semibold-18 break-keep">회의 설명</h4>
              <p className="medium-16 flex-grow text-grayscale-darkgray break-keep">{description}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 flex-grow">
            <h4 className="semibold-18 break-keep">회의 코드</h4>
            <p className="medium-12 text-grayscale-darkgray break-keep">
              회의 진행자에게 전달받은 회의 코드 6자리를 입력해주세요.
            </p>
            <ConferenceCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} /> {/* 수정된 컴포넌트 이름 */}
          </div>
        )}

        <Button type="full" buttonStyle={isConferenceSearchClicked ? "blue" : "black"} onClick={handleSearchButtonClicked}>
          {isConferenceSearchClicked ? (
            <>
              <EnterIcon className="fill-grayscale-white" />
              회의 참여하기
            </>
          ) : (
            <>
              <SearchIcon className="fill-grayscale-white" />
              회의 조회하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default JoinConferenceBack;
