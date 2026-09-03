import { useState, useRef } from 'react';
import { generateLottoNumbers } from './utils/fortuneUtils';
import LottoBall from './components/LottoBall';
import './index.css';

// 메인 앱 컴포넌트: 나만의 번호 기반 조합기
export default function App() {
  // 의미 있는 숫자 입력을 위한 비제어 참조 (상태 최소화 룰 준수)
  const numsRef = useRef(null);
  
  // 추첨 결과 상태 (입력된 베이스 번호 정보, 기본 4게임, 보너스 1게임)
  const [result, setResult] = useState(null);
  
  // 광고 시청 모달 상태
  const [showAd, setShowAd] = useState(false);
  const [adTime, setAdTime] = useState(0);

  // 폼 제출 및 번호 추첨 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = numsRef.current?.value || "";
    
    // 4게임(줄) 생성 로직 (사용자 입력을 넘겨줌)
    const defaultGames = Array.from({ length: 4 }, () => generateLottoNumbers(userInput));
    
    setResult({
      userBase: userInput,
      mainNumbers: defaultGames,
      extraNumbers: null
    });
  };

  // 광고 보상(5번째 게임) 5초 타이머 로직
  const handleWatchAd = () => {
    setShowAd(true);
    const durationMs = parseInt(import.meta.env.VITE_AD_DURATION_MS || '5000', 10);
    let timeLeft = durationMs / 1000;
    setAdTime(timeLeft);

    const timerId = setInterval(() => {
      timeLeft -= 1;
      setAdTime(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timerId);
        setShowAd(false);
        setResult(prev => ({
          ...prev,
          // 마지막 보너스 게임도 동일하게 사용자 조합 베이스로 추출
          extraNumbers: generateLottoNumbers(prev.userBase)
        }));
      }
    }, 1000);
  };

  return (
    <div className="container">
      <h1>{import.meta.env.VITE_APP_TITLE || '나만의 조합 로또'}</h1>
      <p className="subtitle">자신에게 의미 있는 번호를 마음껏 입력하세요.<br/>당신의 번호를 기반으로 완벽한 조합을 만들어 드립니다.</p>
      
      {!result ? (
        <form onSubmit={handleSubmit} className="input-form">
          <input 
            type="text" 
            ref={numsRef} 
            placeholder="예: 7, 12, 33 (쉼표나 띄어쓰기로 구분)" 
          />
          <p className="help-text">※ 번호를 안 넣으시면 완전 자동으로 추첨됩니다.</p>
          <button type="submit">나만의 번호 조합 시작하기</button>
        </form>
      ) : (
        <div className="result-area">
          <div className="lotto-section">
            <h3>나만의 행운 조합 (무료 4게임)</h3>
            <div className="lotto-board">
              {result.mainNumbers.map((line, lineIdx) => (
                <div key={`line-${lineIdx}`} className="lotto-row">
                  {line.map((num, idx) => (
                    <LottoBall key={`main-${lineIdx}-${num}`} number={num} delayIndex={idx} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {result.extraNumbers ? (
            <div className="lotto-section extra-section">
              <h3 className="highlight">🎉 마지막 5번째 게임 (광고 보상)</h3>
              <div className="lotto-row">
                {result.extraNumbers.map((num, idx) => (
                  <LottoBall key={`extra-${num}`} number={num} delayIndex={idx} />
                ))}
              </div>
            </div>
          ) : (
            <button className="ad-btn" onClick={handleWatchAd}>
              🎥 마지막 1줄 (10초 광고 시청)
            </button>
          )}

          <button className="reset-btn" onClick={() => setResult(null)}>다른 번호로 다시 조합하기</button>
        </div>
      )}

      {showAd && (
        <div className="ad-modal">
          <div className="ad-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>스폰서 광고 시청 중...</h2>
            {/* 리액트 렌더링 충돌을 막기 위한 안전한 iframe 배너 호출 */}
            <iframe src="/coupang.html" width="300" height="250" frameBorder="0" scrolling="no" style={{ margin: '15px 0', border: 'none' }}></iframe>
            <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px', wordBreak: 'keep-all' }}>
              "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
            </p>
            <p>마지막 게임 지급까지 남은 시간: <strong>{adTime}</strong>초</p>
          </div>
        </div>
      )}
    </div>
  );
}
