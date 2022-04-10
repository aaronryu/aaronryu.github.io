export interface Activity {
  name: string,
  startDate: string,
  endDate: string,
  details: Array<string>
}

export const activities: Array<Activity> = [
  {
    name: 'TEDxKAIST - 오거나이저 중 \'스피커(연사자 모집)\'팀', startDate: '2016.11', endDate: '2017.03',
    details: [ '12th TEDxKAIST WITH 개최' ],
  },
  {
    name: '동아시아 평화 인권 캠프 (서울대 팀)', startDate: '2014.02', endDate: '2015.06',
    details: [],
  },
]
