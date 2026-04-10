export function convert(param) {
  const year = param.getFullYear();
  const month = String(param.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 [1]
  const day = String(param.getDate()).padStart(2, "0");
  const hours = String(param.getHours()).padStart(2, "0");
  const minutes = String(param.getMinutes()).padStart(2, "0");
  const seconds = String(param.getSeconds()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
}
