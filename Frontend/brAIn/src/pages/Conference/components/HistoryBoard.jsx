import { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryBoard = ({ roomIdHistory }) => {
  const [conclusion, setConclusion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('회의록 넘겨주기 가능 ?',roomIdHistory)
  const HistoryRoomId = roomIdHistory
  useEffect(() => {
    const fetchConclusion = async () => {
      try {
        // 주소 수정
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/load/${HistoryRoomId}`);
        setConclusion(response.data); // 데이터를 상태에 저장
      } catch (err) {
        setError(err.message); // 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchConclusion();
  }, [roomIdHistory]); // roomId가 변경될 때마다 데이터 요청

  // 데이터가 없을 때
  if (!conclusion || Object.keys(conclusion).length === 0) return <p>요약본이 없습니다.</p>;

  // 데이터가 있을 때
  return (
    <div className="conclusion">
      <div>
        <pre>{conclusion}</pre>
      </div>
    </div>
  );
};

export default HistoryBoard;
