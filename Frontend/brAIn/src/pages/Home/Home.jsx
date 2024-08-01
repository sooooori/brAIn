import React from 'react';
import { useSelector } from 'react-redux';
import NewMainCard from './components/NewMainCard';
import JoinConferenceFront from './components/JoinConferenceFront';
import JoinConferenceBack from './components/JoinConferenceBack';
import NewConferenceFront from './components/NewConferenceFront';
import NewConferenceBack from './components/NewConferenceBack';
import JoinMainCard from './components/JoinMainCard';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isConferenceSearchClicked, setIsConferenceSearchClicked] = React.useState(false);
  const [isNewConferenceClicked, setIsNewConferenceClicked] = React.useState(false);
  const [codeInputs, setCodeInputs] = React.useState(Array(6).fill(''));
  const navigate = useNavigate();

  const handleConferenceSearchClickedTrue = () => {
    setIsConferenceSearchClicked(true);
  };

  const handleJoinConferenceFalse = () => {
    setIsConferenceSearchClicked(false);
  };

  const handleNewConferenceTrue = () => {
    setIsNewConferenceClicked(true);
  };

  const handleNewConferenceFalse = () => {
    setIsNewConferenceClicked(false);
  };

  const handleStartClick = () => {
    navigate('/loginoption');
  };

  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { ref: centerRef, inView: centerInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <h1 className="home-title">brAIn</h1>
          <h2 className="home-subtitle">AI와 함께하는 브레인스토밍</h2>
          <div className="card-container">
            <div className={`card ${isNewConferenceClicked ? 'rotate-left' : ''}`}>
              <NewMainCard
                frontComponent={<NewConferenceFront handleNewConferenceTrue={handleNewConferenceTrue} />}
                backComponent={
                  <NewConferenceBack
                    handleNewConferenceFalse={handleNewConferenceFalse}
                    isNewConferenceClicked={isNewConferenceClicked}
                    handleNewConferenceClickedTrue={handleNewConferenceTrue}
                  />
                }
              />
            </div>
            <div className={`card ${isConferenceSearchClicked ? 'rotate-right' : ''}`}>
              <JoinMainCard
                frontComponent={<JoinConferenceFront handleJoinConferenceTrue={handleConferenceSearchClickedTrue} />}
                backComponent={
                  <JoinConferenceBack
                    handleJoinConferenceFalse={handleJoinConferenceFalse}
                    isConferenceSearchClicked={isConferenceSearchClicked}
                    handleConferenceSearchClickedTrue={handleConferenceSearchClickedTrue}
                    codeInputs={codeInputs}
                    setCodeInputs={setCodeInputs}
                  />
                }
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1 className="home-title">About brAIn</h1>
          <h2 className="home-subtitle">
            AI와 함께 생각하고, 표현하고 한 눈에 아이디어를 볼 수 있는 비주얼 워크스페이스
          </h2>
          <Button
            variant="contained"
            className="start-button"
            onClick={handleStartClick}
          >
            brAIn 시작하기
          </Button>
        </div>
      )}
      <div className={`section ${leftInView ? 'fade-left' : ''}`} ref={leftRef}>
        <img src="images/google.png" alt="Left" />
      </div>

      <div className={`section ${rightInView ? 'fade-right' : ''}`} ref={rightRef}>
        <img src="images/google.png" alt="Right" />
      </div>

      <div className={`section ${centerInView ? 'fade-center' : ''}`} ref={centerRef}>
        <img src="images/google.png" alt="Center" />
      </div>
    </div>
  );
};

export default Home;
