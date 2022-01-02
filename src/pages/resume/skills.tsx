export interface Skill {
  name: string,
  startDate: string,
  endDate?: string,
  projects: Array<{
    name: string,
    endDate: string,
    details: Array<{
      name: string,
      subDetails?: Array<string>
    }>
  }>
}

export const skills: Array<Skill> = []

const coupang: Skill = {
  name: 'Coupang, Seoul - Software Developer', startDate: '2017.08',
  projects: [
    {
      name: '쿠팡 물류 발주서 생성 및 관리 시스템 개발에 기여', endDate: '2021',
      details: [
        { name: 'SNOP(TIP) 수요예측에 따른 발주 재고계획서에 따라 각 필요 벤더에게 발주서 발행 시스템' },
        { name: 'Coupang, CPLB 의 발주/반출 및 SKU 관리', subDetails: [
          'Angular.js + Spring (Java)',
          'MYSQL: 발주서 및 SKU, 입고/납품/출고 관련 정보 적재',
          'Elastic Search: 대량 발주서 정보 조회용',
          'Docker -> Kubernetes(k8s) 로 배포 경험 확장'
        ] },
        { name: '선물세트 재고이관 배치 시스템 개발', subDetails: [
          '출발지/도착지 재고 및 판매예측량에 따른 이관 재고 계산',
          'Spring Batch (Java)',
        ] }
      ]
    },
    {
      name: '쿠팡 자회사(떠나요)의 펜션 시스템의 쿠팡 인프라로의 이관 및 전환(리플랫폼) TF', endDate: '2021',
      details: [
        { name: 'ASP.NET (C#) -> Spring (Java)' },
        { name: 'Windows -> Linux and AWS' },
        { name: '아키텍쳐에 상응하는 새 AWS VPC 인프라 구성 및 보안 아키텍쳐 검토 커뮤니케이션/매니징', subDetails: [
          'AWS Network, Zscaler, 보안 구성 및 아키텍팅',
        ] },
        { name: '기존 펜션 시스템의 리플랫폼 이관 개발', subDetails: [
          'React.js / Handlebars.js + Spring (Java)',
          'MSSQL, CockroachDB: 펜션 및 예약 정보 저장, dual-write 전략',
          'Debezium (싱크: MSSQL -> CockroachDB)',
        ] },
      ]
    },
    {
      name: '쿠팡 자회사(떠나요)의 펜션 상품 및 예약 시스템 확장', endDate: '2020',
      details: [
        { name: '펜션만 제공가능한 시스템을 리조트, 카라반 상품도 제공가능하도록 확장', subDetails: [
          'Angular.js + ASP.NET (C#)',
          'MSSQL: 스키마 리디자인',
        ] },
      ]
    },
    {
      name: '쿠팡 내 외부 여행 상품 연동을 위한 API 개발 및 연동', endDate: '2019',
      details: [
        { name: '여행 플랫폼 개발 후 고객에게 더 많은 여행 정보 제공을 위한 연동 시스템 개발', subDetails: [
          'React.js + Spring Boot (Kotlin)',
          'Couchbase: 연동된 여행 상품 정보 저장',
        ] },
      ]
    },
    {
      name: '쿠팡 여행 관련 ‘상품 정보 관리’ 및 ‘예약 시스템’ 개발에 기여', endDate: '2018',
      details: [
        { name: '기존 쿠팡 플랫폼의 스키마는 여행 상품에 비적합하여 여행 플랫폼 개발', subDetails: [
          'React.js / Handlebars.js + Spring (Java)',
          'Couchbase: 여행 상품 정보 저장',
          'Elastic Search: 예약 현황, 판매량 파악',
          'RebbitMQ, Kafka: 결제 완료 및 예약 진행상황 싱크',
        ] },
      ]
    },
  ]
}