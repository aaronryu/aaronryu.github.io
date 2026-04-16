// 배열을 랜덤하게 섞는 함수 (Fisher-Yates)
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 요소 위치 교환
  }
  return array;
}
