import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { resetRoundBoard } from '../../actions/roundRobinBoardAction';
import axios from '../../utils/Axios';
import ConferenceHistoryModal from './components/ConferenceHistoryModal';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isConferenceSearchClicked, setIsConferenceSearchClicked] = useState(false);
  const [isNewConferenceClicked, setIsNewConferenceClicked] = useState(false);
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(''));
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const [centerVisible, setCenterVisible] = useState(true);
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [conferenceHistory, setConferenceHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  dispatch(resetRoundBoard());

  useEffect(() => {
    if (leftInView) {
      setLeftVisible(true);
      const timer = setTimeout(() => setLeftVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setLeftVisible(false);
    }
  }, [leftInView]);

  useEffect(() => {
    if (rightInView) {
      setRightVisible(true);
      const timer = setTimeout(() => setRightVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setRightVisible(false);
    }
  }, [rightInView]);

  useEffect(() => {
    if (centerInView) {
      setCenterVisible(true);
      const timer = setTimeout(() => setCenterVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setCenterVisible(false);
    }
  }, [centerInView]);

  useEffect(() => {
    localStorage.removeItem('roomToken');
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const fetchConferenceHistory = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/history`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.data && Array.isArray(response.data)) {
            setConferenceHistory(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
            setConferenceHistory([]);
          }
        } catch (error) {
          console.error('Error fetching conference history:', error);
          setConferenceHistory([]);
        }
      };
  
      fetchConferenceHistory();
    }
  }, [isAuthenticated, accessToken]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = conferenceHistory.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(conferenceHistory.length / itemsPerPage);
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);

  // 표시할 페이지 번호 범위 계산
  const startIndex = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const endIndex = Math.min(startIndex + 9, pageCount);
  const visiblePageNumbers = pageNumbers.slice(startIndex - 1, endIndex);

  const handleNextPage = () => {
    if (endIndex < pageCount) {
      setCurrentPage(prevPage => Math.min(prevPage + 10, pageCount));
    }
  };

  const handlePreviousPage = () => {
    if (startIndex > 1) {
      setCurrentPage(prevPage => Math.max(prevPage - 10, 1));
    }
  };

  const handleOpenModal = (conferenceId) => {
    const id = Number(conferenceId);
    if (!isNaN(id) && id > 0) {
      setSelectedConferenceId(id);
      setIsModalOpen(true);
    } else {
      console.error("Invalid conferenceId:", conferenceId);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConferenceId(null);
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <>
          <h1 className='home-title-login'>시작하기</h1>
          <h2 className='home-subtitle-login'>AI와 함께하는 신개념 브레인스토밍 플랫폼</h2>
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
          
          <h1 className='home-title-login'>지난 회의 목록</h1>
          <h2 className='home-subtitle-login'>지금까지 참여한 회의 목록 확인</h2>
          <div className="home-conference-list">
            {currentItems.map(conference => (
              <div 
                key={conference.conferenceId} 
                className="home-conference-card" 
                onClick={() => handleOpenModal(conference.roomId)}>
                <h3>회의 주제 : {conference.subject}</h3>
                <p>참가자: {conference.members.map(member => member.name).join(', ')}</p>
                <p>시작 시간 : {new Date(conference.totalTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="home-pagination">
            <button onClick={handlePreviousPage} disabled={startIndex === 1}>
              Previous
            </button>
            {visiblePageNumbers.map(pageNumber => (
              <span
                key={pageNumber}
                className={`page-number ${currentPage === pageNumber ? 'active' : 'inactive'}`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </span>
            ))}
            <button onClick={handleNextPage} disabled={endIndex >= pageCount}>
              Next
            </button>
          </div>

          <ConferenceHistoryModal 
            isOpen={isModalOpen}
            conferenceId={selectedConferenceId}
            onClose={handleCloseModal} />

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
