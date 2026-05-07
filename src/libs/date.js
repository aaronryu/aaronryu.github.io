export function convert(param, lang = "en") {
  const dateObj = new Date(param);
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  // (A) 날짜 포맷 설정
  const dateConfigs = {
    ko: { year: "numeric", month: "long", day: "numeric" },
    en: { month: "short", day: "2-digit", year: "numeric" },
    ja: { year: "numeric", month: "long", day: "numeric" },
  };

  const dateFormatter = new Intl.DateTimeFormat(
    lang === "ko" ? "ko-KR" : lang === "ja" ? "ja-JP" : "en-US",
    dateConfigs[lang] || dateConfigs.en,
  );

  const datePart = dateFormatter.format(dateObj);

  // (B.1) 시간 포맷 설정 - 이전 00:00 표기 버전
  // const timeConfigs = {
  //   ko: { hour: '2-digit', minute: '2-digit', hour12: false },
  //   en: { hour: '2-digit', minute: '2-digit', hour12: true }, // AM/PM 활성화
  //   ja: { hour: '2-digit', minute: '2-digit', hour12: false },
  // };

  // // 3. 포맷터 생성
  // const dateFormatter = new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US', dateConfigs[lang] || dateConfigs.en);
  // const timeFormatter = new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US', timeConfigs[lang] || timeConfigs.en);

  // const datePart = dateFormatter.format(dateObj);
  // const timePart = timeFormatter.format(dateObj);

  // (B.2) 시간 포맷 설정 - 신규 00시 00분 표기 버전
  let timePart = "";
  if (lang === "en") {
    timePart = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);
  } else if (lang === "ja") {
    timePart = `${hours}時 ${minutes}分`;
  } else {
    timePart = `${hours}시 ${minutes}분`;
  }

  return {
    date: datePart,
    time: timePart,
    full: lang === "en" ? `${datePart}, ${timePart}` : `${datePart} ${timePart}`,
  };
}
