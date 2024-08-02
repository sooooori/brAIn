import React, { useState, useEffect } from 'react';
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
  const [isConferenceSearchClicked, setIsConferenceSearchClicked] = useState(false);
  const [isNewConferenceClicked, setIsNewConferenceClicked] = useState(false);
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(''));
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const [centerVisible, setCenterVisible] = useState(true);
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
    threshold: 0.7,
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    threshold: 0.5,
  });

  const { ref: centerRef, inView: centerInView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (leftInView) {
      setLeftVisible(true);
      const timer = setTimeout(() => setLeftVisible(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    } else {
      setLeftVisible(false);
    }
  }, [leftInView]);

  useEffect(() => {
    if (rightInView) {
      setRightVisible(true);
      const timer = setTimeout(() => setRightVisible(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    } else {
      setRightVisible(false);
    }
  }, [rightInView]);

  useEffect(() => {
    if (centerInView) {
      setCenterVisible(true);
      const timer = setTimeout(() => setCenterVisible(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    } else {
      setCenterVisible(false);
    }
  }, [centerInView]);

  return (
    <div className="home-container">
      {!isAuthenticated ? (
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
          <div className={`section ${leftInView && leftVisible ? 'fade-left' : 'fade-out'}`} ref={leftRef}>
            <img src="images/main_image_1.png" alt="Left" />
          </div>

          <div className={`section ${rightInView && rightVisible ? 'fade-right' : 'fade-out'}`} ref={rightRef}>
            <img src="images/main_image_2.png" alt="Right" />
          </div>

          <div className={`section ${centerInView && centerVisible ? 'fade-center' : 'fade-out'}`} ref={centerRef}>
            <img src="images/main_image_3.png" alt="Center" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
