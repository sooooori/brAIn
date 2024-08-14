import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from '../../../components/Button/Button';
import './MiddleProduct.css';
import { useState } from "react";

const MiddleProduct = ({ closeModal, roomId }) => { // closeModal을 prop으로 받아옴
    const [ product, setProduct ] = useState([]);
    const [ loading, setLoading ] = useState(true);



    const navigate = useNavigate();

    const exitHandler = () => {
        navigate('/');
    }

    useEffect(()=>{
        const ProductScript = async () => {
            try {
                setLoading(true);
                console.log('roomId: ', roomId);
                const historyRoomId = roomId;
                console.log('historyroomId: ', historyRoomId);
                const response = await axios.get(`http://localhost/api/v1/conferences/products/${historyRoomId}`);
                
                setProduct(response.data);
                console.log('스크립트 요청 보냈삼~');
            
            } catch (error) {
                console.log('스크립트 개 오래걸림');
    
            } finally {
                setLoading(false);
            }
        };
        ProductScript();
    }, []); // 의존성 배열을 추가하여 useEffect가 컴포넌트 마운트 시에만 실행되도록 함

    const ProductFile = async () => {
        try {
          console.log('다운로드 요청 보냈삼~');
          const response = await axios.get(`http://localhost/api/v1/conferences/download/${roomId}`, {
            responseType: 'blob',
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `회의록_${roomId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('회의록 줬다~');
        } catch (error) {
          console.log('다운로드 에라 발생 !!', error);
        }
      };

    return (
        <div className="download-card">
            <div className="modaldal-content">
                <div className='exit-btn'>
                        <button onClick={closeModal}>
                            X
                        </button>
                </div>

                <div className="product-content">
                    {loading ? (
                        <div className='spinner-body'>
                            <div className="spinner"></div>
                            <p className="loading-text">회의록 미리보기 생성중...</p>
                        </div>
                    ) : (
                        <pre>{product}</pre> 
                    )}
                </div>
                <div className='button-layer'>
                    <Button
                        className="product" 
                        onClick={ ProductFile }
                    >
                        <p>회의록 PDF 다운로드</p>
                    </Button>

                    <Button 
                        className='real-exit'
                        onClick={ exitHandler }
                    >
                        <p>회의 나가기</p>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MiddleProduct;
