// 1~45 사이 숫자 파싱 및 '하프 균형 분배' 하이브리드 조합 알고리즘
export const generateLottoNumbers = (userNumbersStr = "") => {
  const rawParts = userNumbersStr.split(/[, \n]+/);
  let parsedNumbers = [];

  // 1. 입력된 숫자 분할 및 1자리/2자리 슬라이딩 탐색
  for (const part of rawParts) {
    const num = parseInt(part.trim(), 10);
    if (isNaN(num)) continue;

    if (num >= 1 && num <= 45) {
      parsedNumbers.push(num);
    } else if (num > 45) {
      const strNum = String(num);
      for (let i = 0; i < strNum.length; i++) {
        const d = parseInt(strNum[i], 10);
        if (d >= 1 && d <= 45) parsedNumbers.push(d);
      }
      for (let i = 0; i < strNum.length - 1; i++) {
        const d2 = parseInt(strNum.substring(i, i + 2), 10);
        if (d2 >= 1 && d2 <= 45) parsedNumbers.push(d2);
      }
    }
  }

  const validUserNums = [...new Set(parsedNumbers)];
  let result = [];

  // 번호대(Band)를 구하는 헬퍼 함수
  const getBand = (n) => {
    if (n < 10) return 0;
    if (n < 20) return 1;
    if (n < 30) return 2;
    if (n < 40) return 3;
    return 4;
  };

  if (validUserNums.length > 0) {
    // 2. 사용자 풀(Pool)에서 픽업할 때는 '구역 할당'을 폐지하고 완전 자유 무작위 셔플로 롤백
    // (경쟁자가 없는 27, 40 등이 100% 고정되는 부작용 해결)
    const shuffledPool = [...validUserNums].sort(() => 0.5 - Math.random());
    
    let takeCount = validUserNums.length;
    if (takeCount >= 6) {
      takeCount = Math.floor(Math.random() * 4) + 3; // 3 ~ 6개 채택
    }
    
    result = shuffledPool.slice(0, takeCount);
  }

  // 3. 빈자리를 채울 때만 '비어있는 번호대(색상)'를 최우선으로 찾아 난수로 채움 (밸런스 유지)
  while (result.length < 6) {
    const currentBands = result.map(getBand);
    const missingBands = [0, 1, 2, 3, 4].filter(b => !currentBands.includes(b));

    let targetBand;
    if (missingBands.length > 0) {
      targetBand = missingBands[Math.floor(Math.random() * missingBands.length)];
    } else {
      targetBand = Math.floor(Math.random() * 5);
    }

    let randNum;
    if (targetBand === 0) randNum = Math.floor(Math.random() * 9) + 1; // 1~9
    else if (targetBand === 1) randNum = Math.floor(Math.random() * 10) + 10; // 10~19
    else if (targetBand === 2) randNum = Math.floor(Math.random() * 10) + 20; // 20~29
    else if (targetBand === 3) randNum = Math.floor(Math.random() * 10) + 30; // 30~39
    else randNum = Math.floor(Math.random() * 6) + 40; // 40~45

    if (!result.includes(randNum)) {
      result.push(randNum);
    }
  }

  return result.sort((a, b) => a - b);
};

// 로또 번호 범위에 따른 배경 색상 반환
export const getLottoColor = (number) => {
  if (number <= 10) return '#fbc400'; // 노랑
  if (number <= 20) return '#69c8f2'; // 파랑
  if (number <= 30) return '#ff7272'; // 빨강
  if (number <= 40) return '#aaaaaa'; // 회색
  return '#b0d840'; // 초록
};
