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
          <h1 className="home-title">시작하기</h1>
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
          <h1 className="home-title">About BrAIn</h1>
          <h2 className="home-subtitle">
            AI와 함께하는 신개념 브레인스토밍 플랫폼 <br /> 
          </h2>
          <Button
            type="fit"
            buttonStyle="orange"
            className="button-primary"
            onClick={handleStartClick}
            ariaLabel="Start BrAIn"
          >
            BrAIn 시작하기
          </Button>
          
          <div className="intro-container">
            <img src="images/main_image_intro.png" alt="Intro" />
          </div>
          <div className={`section ${leftInView ? 'fade-left' : ''}`} ref={leftRef}>
            <img src="images/main_image_1.png" alt="Left" />
          </div>

          <div className={`section ${rightInView ? 'fade-right' : ''}`} ref={rightRef}>
            <img src="images/main_image_2.png" alt="Right" />
          </div>

          <div className={`section ${centerInView ? 'fade-center' : ''}`} ref={centerRef}>
            <img src="images/main_image_3.png" alt="Center" />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Home;
