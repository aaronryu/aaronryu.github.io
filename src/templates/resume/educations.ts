export interface University {
  name: string,
  major: string,
  degree: string,
  startDate: string,
  endDate?: string,
  projects: Array<{
    name: string,
    details: Array<{
      name: string,
      subDetails?: Array<string>
    }>
  }>
}

const kaist: University = {
  name: '한국과학기술원', major: '전산학부', degree: '석사', startDate: '2015.08', endDate: '2017.08',
  projects: [
    {
      name: 'HypergraphDB와 같은 그래프 데이터베이스 조사, 하이퍼그래프에 대한 질의 프로세싱 관련 연구',
      details: []
    },
  ]
}

const kau: University = {
  name: '한국항공대학교', major: '컴퓨터 및 정보 공학과', degree: '학사', startDate: '2011.02', endDate: '2015.02',
  projects: [
    {
      name: 'Hadoop 및 HDFS 을 활용한 영상처리 연구 및 개발',
      details: []
    },
  ]
}

export const universities: Array<University> = [
  kaist, kau,
]