// 배열을 랜덤하게 섞는 함수 (Fisher-Yates)
// export function randomShuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]]; // 요소 위치 교환
//   }
//   return array;
// }

// 배열을 주단위로 순차 순환하는 함수 (Modulo)
//   export function moduloShuffle() {
//   // 1. 전체 포스트를 고정된 기준(ID 등)으로 정렬 (항상 동일한 순서 유지)
//   const sortedPosts = allPosts.sort((a, b) => a.id.localeCompare(b.id));

//   // 2. 빌드 시점의 '날짜'를 기준으로 오프셋(Offset) 계산
//   const startDate = new Date("2024-01-01"); // 기준점
//   const today = new Date();
//   const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
//   const weekIndex = Math.floor(diffDays / 7); // 주 단위로 변경 시

//   // 3. 현재 페이지의 인덱스를 고려하여 4개 추출 (순환)
//   const getRelatedPosts = (currentPostId) => {
//     const currentIndex = sortedPosts.findIndex(p => p.id === currentPostId);
//     // 현재 글을 제외하고, 주차(weekIndex)를 더해 시작 지점을 계속 이동
//     return Array.from({ length: 4 }, (_, i) => {
//       const targetIndex = (currentIndex + weekIndex + i + 1) % sortedPosts.length;
//       return sortedPosts[targetIndex];
//     });
//   };
// }

// 배열을 랜덤하게 섞는 함수 (Fisher-Yates)
export function randomShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 요소 위치 교환
  }
  return array;
}
