export interface Patent {
  name: string,
  issuedDate: string,
  description: string,
  author: Array<string>
}

export const patents: Array<Patent> = [
  {
    name: '동영상 파일을 하둡 분산 파일 시스템에 분산 저장하는 시스템, 동영상 맵리듀스 시스템 및 그 제공방법', issuedDate: '2013',
    description: '출원번호: 2013-0071441 / 출원일: 2013년 06월 21일, 등록일: 2014년 11월 04일',
    author: [ '김철기', '장민욱', '이대철', '유충모' ]
  },
]
