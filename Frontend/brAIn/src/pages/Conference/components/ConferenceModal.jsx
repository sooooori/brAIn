import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './ConferenceModal.css'; // CSS 파일을 가져옵니다
import Button from '../../../components/Button/Button'; // 공통 버튼 컴포넌트 가져오기

const ConferenceModal = () => {
    const curStep = useSelector((state) => state.conferenceInfo.curStep); // 상태의 경로를 정확히 설정하세요
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (curStep) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 10000); // 10초 후에 모달을 자동으로 숨기기

            return () => clearTimeout(timer);
        }
    }, [curStep]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    let modalContent;

    switch (curStep) {
        case 'STEP_0':
            modalContent = (
                <div className="modal-content">
                    <p>이번 단계는 아이디어 준비 단계입니다. 주제에 대한 의견을 정리해주세요.</p>
                    <p>제한 시간: 05:00</p>
                    <div className="button-container">
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                </div>
            );
            break;
        case 'STEP_1':
            modalContent = (
                <div className="modal-content">
                    <p>이번 단계는 아이디어 공유 단계입니다. 주제에 대한 당신의 의견을 내주세요.</p>
                    <p>라운드 당 제한 시간: 02:00</p>
                    <div className="button-container">
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                </div>
            );
            break;
        case 'STEP_2':
            modalContent = (
                <div className="modal-content">
                    <p>이번 단계는 투표 단계입니다. 당신의 Top3에 투표하세요.</p>
                    <p>제한 시간: 02:00</p>
                    <div className="button-container">
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                </div>
            );
            break;
        case 'STEP_3':
            modalContent = (
                <div className="modal-content">
                    <p>이번 단계는 아이디어 구체화 단계입니다. 각 아이디어에 대한 자신만의 의견을 작성해주세요.</p>
                    <p>제한 시간: 05:00</p>
                    <div className="button-container">
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                </div>
            );
            break;
        case 'STEP_4':
            modalContent = (
                <div className="modal-content">
                    <p>이번 단계는 아이디어에 대해 자유롭게 토론을 진행하세요.</p>
                    <div className="button-container">
                        <Button onClick={handleClose}>확인</Button>
                    </div>
                </div>
            );
            break;
        default:
            modalContent = null;
    }

    return (
        <div className="modal">
            {modalContent}
        </div>
    );
};

export default ConferenceModal;

