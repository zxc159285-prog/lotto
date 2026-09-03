import { getLottoColor } from '../utils/fortuneUtils';

// 단일 로또 공을 애니메이션 딜레이와 함께 렌더링하는 컴포넌트
export default function LottoBall({ number, delayIndex = 0 }) {
  const bgColor = getLottoColor(number);

  return (
    <div 
      className="lotto-ball" 
      style={{ backgroundColor: bgColor, animationDelay: `${delayIndex * 0.15}s` }}
    >
      {number}
    </div>
  );
}
