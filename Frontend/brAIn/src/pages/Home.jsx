import { useState } from "react";
import Header from "@/components/Header/Header";
import MainCard from "./components/MainCard";
import NewConferenceFront from "./components/NewConferenceFront";
import NewConferenceBack from "./components/NewConferenceBack";
import JoinConferenceBack from "./components/JoinConferenceBack";
import JoinConferenceFront from "./components/JoinConferenceFront";

const Home = () => {
  const [isNewConferenceClicked, setIsNewConferenceClicked] = useState(false);
  const [isJoinConferenceClicked, setIsJoinConferenceClicked] = useState(false);
  const [isConferenceSearchClicked, setIsConferenceSearchClicked] = useState(false);
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));

  const handleNewConferenceFalse = () => {
    setIsNewConferenceClicked(false);
  };

  const handleNewConferenceTrue = () => {
    setCodeInputs(Array(6).fill(""));
    setIsConferenceSearchClicked(false);
    setIsJoinConferenceClicked(false);
    setIsNewConferenceClicked(true);
  };

  const handleJoinConferenceFalse = () => {
    setCodeInputs(Array(6).fill(""));
    setIsConferenceSearchClicked(false);
    setIsJoinConferenceClicked(false);
  };

  const handleJoinConferenceTrue = () => {
    setIsNewConferenceClicked(false);
    setIsJoinConferenceClicked(true);
  };

  const handleConferenceSearchClickedTrue = () => {
    setIsConferenceSearchClicked(true);
  };

  return (
    <>
      <Header type="main" />
      <section className="flex flex-col my-20 items-center justify-center">
        <h1 className="semibold-64 mb-2">시작하기</h1>
        <p className="semibold-20 text-grayscale-darkgray">볼록과 함께 실시간 회의를 경험해보세요.</p>
        <div className="flex flex-col items-center justify-center gap-8 mt-16 home:flex-row w-full">
          {window.Modernizr.touchevents ? (
            ""
          ) : (
            <MainCard isButtonClicked={isNewConferenceClicked}>
              <NewConferenceFront handleNewConferenceTrue={handleNewConferenceTrue} />
              <NewConferenceBack handleNewConferenceFalse={handleNewConferenceFalse} />
            </MainCard>
          )}
          <MainCard isButtonClicked={isJoinConferenceClicked}>
            <JoinConferenceFront handleJoinConferenceTrue={handleJoinConferenceTrue} />
            <JoinConferenceBack
              handleJoinConferenceFalse={handleJoinConferenceFalse}
              isConferenceSearchClicked={isConferenceSearchClicked}
              handleConferenceSearchClickedTrue={handleConferenceSearchClickedTrue}
              codeInputs={codeInputs}
              setCodeInputs={setCodeInputs}
            />
          </MainCard>
        </div>
      </section>
    </>
  );
};

export default Home;