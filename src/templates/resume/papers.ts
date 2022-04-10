export interface Paper {
  name: string,
  issuedDate: string,
  attended: string,
  author: Array<string>
}

export const papers: Array<Paper> = [
  {
    name: '대용량 하이퍼그래프에 대한 효율적인 탐색 기법과 분석에의 응용', issuedDate: '2017.07',
    attended: '컴퓨팅의 실제 분야: 정보과학회 컴퓨팅의 실제 논문지(KIISE Transactions on Computing Practices, KTCP)',
    author: [ '류충모', '서정혁', '김명호' ]
  },
  {
    name: '동형 서브그래프 검사를 이용한 향상된 하이퍼그래프 쿼리 시스템 설계', issuedDate: '2017.06',
    attended: '2017 한국컴퓨터종합학술대회 (KCC 2017)',
    author: [ '류충모', '서정혁', '김명호' ]
  },
  {
    name: '대용량 하이퍼그래프에 대한 효율적인 BFS, DFS 탐색 기법', issuedDate: '2016.12',
    attended: '한국정보과학회 (제43회) 2016년 동계학술대회 논문집, 205-207 + 우수발표논문상 수상',
    author: [ '류충모', '서정혁', '김명호' ]
  },
  {
    name: '하둡 분산 시스템에서의 효율적인 데이터 분할 기법', issuedDate: '2015.06',
    attended: '한국정보과학회 학술발표논문집 (한국컴퓨터종합학술대회 논문집) 제42권 1호 1668~1670',
    author: [ '장민욱', '이대철', '정재헌', '류충모', '김철기' ]
  },
  {
    name: 'Extensible Video Processing Framework in Apache Hadoop', issuedDate: '2013.12',
    attended: 'IEEE International Conference on Cloud Computing Technology and Science (CloudCom) + Demo session',
    author: [ '류충모', '이대철', '장민욱', '김철기', '서의성' ]
  },
  {
    name: 'Hadoop 기반 클라우드 컴퓨팅을 이용한 영상 처리 프레임워크 구현', issuedDate: '2013.11',
    attended: '제40회 한국정보처리학회 추계학술발표대회 논문집 제20권 2호 139~142',
    author: [ '류충모', '이대철', '장민욱', '김철기' ]
  }, 
]
