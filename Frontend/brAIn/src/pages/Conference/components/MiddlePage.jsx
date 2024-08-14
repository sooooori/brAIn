import { useState } from 'react';
import Button from '../../../components/Button/Button';
import './MiddlePage.css';
import MiddleProduct from './MiddleProduct';
import axios from 'axios';

const MiddlePage = () => {

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ product, setProduct ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const roomId = 46;

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const ProductScript = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`http://localhost/api/v1/conferences/products/${roomId}`);
            
            setProduct(response.data);
            console.log('스크립트 요청 보냈삼~');
        
        } catch (error) {
            console.log('스크립트 개 오래걸림');

        } finally {
            setLoading(false);
        }
    };

    const LoadBtn = () => {
        openModal();
        ProductScript();
    };

    return (
        <div className="middle-page">

            <img src="/images/brAIn_2.png" alt="Logo" /> {/* 이미지 추가 */}
            <div className='write'>
                <h1>
                    아이디어 도출 과정이 끝났습니다.
                    <br />
                    토론 단계를 진행하시겠습니까 ?
                </h1>
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
                    onClick={ LoadBtn }
                >
                    <p>회의록 받고 나가기</p>
                </Button>
            </div>

            {/* 모달창 */}
            {isModalOpen && (
                <div className='modaldal'>
                    <div className='modaldal-content'>

                        <div className='exit-btn'>
                            <button onClick={ closeModal }>
                                X
                            </button>
                        </div>

                        <div className="product-content">
                            {loading ? ( // 로딩 중일 때
                                <div className='spinner-body'>
                                    <div className="spinner"></div> {/* 로딩 스피너 */}
                                    <p className="loading-text">회의록 미리보기 생성중...</p>
                                </div>
                            ) : ( // 데이터가 로드된 후
                                <pre>{product}</pre> 
                            )}
                        </div>

                        <MiddleProduct />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiddlePage;