import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from '../../../components/Button/Button';
import './MiddleProduct.css';

const MiddleProduct = () => {
    
    const navigate = useNavigate()

    const exitHandler = () => {
        navigate('/')
    }

    const roomId = 46;

    const ProductFile = async () => {
        try {
          // 파일을 바이너리 데이터로 받기 위해 responseType 설정
          console.log('다운로드 요청 보냈삼~');
          const response = await axios.get(`http://localhost/api/v1/conferences/download/${roomId}`, {
            responseType: 'blob', // blob 형태로 데이터를 받음
          });
    
          // 다운로드를 트리거하기 위한 URL 생성
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `회의록_${roomId}.pdf`); // 다운로드될 파일 이름
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 다운로드 후 링크 제거
          console.log('회의록 줬다~')
        } catch (error) {
          console.log('다운로드 에라 발생 !!', error);
        }
      };

    return (
        <div className="download-card">

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
    );
};

export default MiddleProduct;