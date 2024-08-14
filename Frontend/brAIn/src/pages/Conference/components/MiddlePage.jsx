import { useState } from 'react';
import Button from '../../../components/Button/Button';
import './MiddlePage.css';
import MiddleProduct from './MiddleProduct';
import axios from 'axios';

const MiddlePage = ({roomId}) => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isMiddlePageModalOpen, setIsMiddlePageModalOpen] = useState(true); // MiddlePage 모달 상태 추가

    const roomIdMiddlePage = roomId;

    const closeMiddlePageModal = () => {
        setIsMiddlePageModalOpen(false);
    }

    const closeProductModal = () => {
        setIsProductModalOpen(false);
    }

    const openProductModal = () => {
        closeMiddlePageModal(); // MiddlePage 모달 닫기
        setIsProductModalOpen(true); // MiddleProduct 모달 열기
    };

    return (
        <>
            {isMiddlePageModalOpen && (
                <div className="middle-page">
                    <div className='modaldal-content'>
                        <img src="/images/brAIn_2.png" alt="Logo" /> {/* 이미지 추가 */}
                        <div className='write'>
                            <h2>
                                아이디어 도출 과정이 끝났습니다.
                                <br />
                                토론 단계를 진행하시겠습니까 ?
                            </h2>
                        </div>
                        <div className='button-layer'>
                            <Button
                                className='move'
                                // onClick={}
                            >
                                <p>화상 회의 시작하기</p>
                            </Button>
                            <Button
                                className='exit'
                                onClick={openProductModal}
                            >
                                <p>회의록 받고 나가기</p>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MiddleProduct 모달창 */}
            {isProductModalOpen && (
                <MiddleProduct closeModal={closeProductModal} 
                roomIdMiddlePage={roomIdMiddlePage}
                />
            )}
        </>
    );
};

export default MiddlePage;
