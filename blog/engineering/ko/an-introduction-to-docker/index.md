---
title: "Docker 간단하게 살펴보는 기본 개념"
category: ["Deployment"]
created: 2020-08-19T17:52:48.000Z
updated: 2021-02-04T16:17:46.181Z
deck: 서비스 환경을 구축할 때 마다 마주하는 복잡한 설정과 자원 낭비의 문제를 해결하기 위해 등장한 Docker의 핵심 철학을 알아본다. 가상 머신(VM)보다 가벼운 컨테이너 기술이 어떻게 애플리케이션의 배포와 관리를 혁신했는지 그 구조적 차이를 파헤쳐 본다.
abstract: 단일 호스트 OS 위에서 논리적으로 자원을 분배하는 컨테이너의 개념을 VM과 비교하여 상세히 학습한다. Docker 이미지의 정의부터 컨테이너와의 관계, 그리고 실제 서비스 배포를 위한 Dockerfile의 작성법과 주요 명령어(FROM, ENV, COPY, EXPOSE 등)를 실무 예제를 통해 이해한다.
keywords: Docker, 컨테이너, VM vs Container, Dockerfile, 가상화
description: 가상 머신보다 효율적인 자원 관리를 지원하는 Docker의 컨테이너 기술과 이미지 기반 배포 방식을 설명하고, 서버 환경 구축을 위한 Dockerfile 작성 가이드를 제공합니다.
---

# Docker 를 왜 사용하는가?

하나의 서버에 다양한 Application 들을 구동시키려면 여러 VM 들을 올려놓고 각 Application 마다 VM 을 할당해주는 방법도 있지만, Docker 는 각 Application 을 VM 보다 가벼운 Container 단위로 패키징 및 관리를 가능하게 합니다.

# Container 는 무엇인가?

## VM vs Container

VM 개념은 단일 Host OS 위에 다수의 Guest OS 를 갖고 각각 Application 을 단일 Guest OS 에 매핑한것인 반면

> [ Host OS - [ **VM**: Guest OS - Libs - App ] ]

**Container 는 단일 Host OS 위에 다수의 Application 을 바로 구동할 수 있는 VM 보다 가벼운 단위**입니다. Host OS 와 Container 사이 포트 포워딩이나 파일시스템(디렉토리) 연동 등은 후술할 Image 설정으로 가능합니다.

> [ Host OS - [ **Container**: Libs - App ] ]

VM 은 Hypervisor 에 의해 물리적 자원 관리가 된다면 Container 는 Docker 에 의해 논리적으로 자원 분배가 됩니다.

- VM 은 Hypervisor 에 의한 하드웨어 가상화
- Container 는 Docker 에 의한 Host OS 가상화

과거 학부때 데모 실행을 위해 멀티 노드 하둡구성시 사용 경험이 있는 LXC(Linux Container) 개념이 Docker 의 초기 버전의 구현이었다고 합니다만 이후 Docker 는 자체 컨테이너를 사용한다고 합니다.

## Image and Container

Docker 를 처음 접하며 명확히 구별하지 못했던 개념이 있습니다. ‘Image’와 ‘Container’입니다. Image 는 VM 에서의 개념과 동일하기에 쉽게 이해하실 수 있습니다.

- **Image** 는 Container 구동을 위한 파일시스템과 구동에 필요한 설정들이 모여있는 **정적 설정**이며,
- **Container** 는 위 Image 를 기반으로 실제 구동(Runtime)된 **동적 인스턴스**라고 보면 됩나다.

# Container 를 왜 사용하는가?

## Application 단위 관리

Application 단위로 패키징을 가능하게 함으로써 개발 시 역할/책임(R&R)을 분리할 수 있습니다. 웹 서비스를 개발하면 하나의 서버 인스턴스에 다양한 역할들이 들어있는데, 각각 독립된 Container 로 분리할 수 있습니다.

- **nginx**: 정적 페이지 제공 및 SPA 프론트엔드
- **tomcat**: 프론트엔드에 제공될 API 서버
- **logstash** (로그 수집) : nginx, tomcat 에서 발생하는 log 들을 log 적재 서버에 전송
- **prometheus** (매트릭 수집) : nginx, tomcat 에서 발생하는 오류 로그 및 CPU, memory 등 자원 상태를 상태 관리 서버에 전송
- **pinpoint** (성능 측정) : tomcat 에서 타 서버들의 API 콜에 대한 횟수, 지연시간 등을 성능 관리 서버에 전송

즉, 위 예시와 같이 하나의 서버 인스턴스에 총 5개의 Container 가 작동될 수 있습니다.

만약 프론트엔드에 제공할 API 서버뿐만 아니라 외부에서 직접 호출할 수 있는 API 서버를 추가하고싶다면 tomcat 컨테이너를 하나 더 추가하여 총 2개의 tomcat 을 하나의 서버 인스턴스에 두고 사용할 수 있습니다. Java 기반 tomcat 을 Python 기반 django 로 교체할 수 도 있습니다. 프론트엔드를 제공하는 nginx 서버는 그대로 있으면서 API 서버만 교체된것이죠.

각 Application 을 레고 블럭처럼 관리하는건 배포에도 큰 이점이 있습니다. 단지 하나의 컨테이너 버전만 업데이트하고싶다면 해당 컨테이너의 이미지만 다시 받아서 재배포를 진행하면 됩니다. 각 컨테이너마다 버전 관리를 따로 할 수 있는것이죠.

> 레고 블럭처럼 Application 들을 관리할 수 있다는 장점은 VM 도 갖고있지만, 그보다 더 <b>Container 를 선호하는 이유는 가상화의 레벨이 상위 레벨인 만큼 가볍고(Container = lightweight VM), 위에 설명했듯이 버전 및 배포관리가 이미지로 관리되므로 ① 이미지 설정과 ② 배포가 구분되어있어 과정의 자동화가 쉽기 때문입니다. [성능 측면에서도 Container 간 IO 및 네트워크 처리에 있어서 빠르기도 합니다.](https://medium.com/@darkrasid/docker%EC%99%80-vm-d95d60e56fdd)</b> 가상화의 레벨이 로우 레벨인 VM 은 보안 측면에서의 캡슐화가 Container 보다 더 뛰어나다고 하지만, 현재 기술에서는 둘간 얼마나 큰 차이가 있을지 궁금하군요.

이처럼 Docker 로는 Application 이 구동될 환경과 구동할 이미지를 설정합니다. Application 각각의 자체 설정은 docker 와 별개로 프로젝트 내부에 설정해놓으면 됩니다. 책임 분리인 셈입니다.

# Docker 사용 시 마주하는 용어들

- **Registry** = Images storage
  - Image 들을 저장헤놓는 중앙 저장소
  - 일반적으로 배포 파이프라인을 구성하면 최신 소스를 통해 Docker Engine 으로 생성한 tomcat/nginx 이미지를 Registry 에 올린뒤, 해당 이미지로 최종 서버 배포를 진행합니다.
  - 기본 Docker Hub 서버 혹은 회사/개인용 Docker Hub 서버를 만들어서 사용하거나
  - Amazon AWS 에서 제공하는 ECR(AWS EC2 Continaer Registry)를 사용할 수도 있습니다.
- **Image**
  - 전에 설명했듯 Container 동작을 위한 파일시스템과 구동에 필요한 설정들이 모여있는 정적 설정입니다.
  - [Image 는 RO(Read-Only) 파일시스템의 집합](https://docs.docker.com/engine/storage/drivers/#images-and-layers)입니다.
    - 좀 더 [상세한 파일시스템 구조]()는 다음을 참조하세요.
- **Container**
  - 위 Image 기반으로 실제 구동(Runtime)된 동적 인스턴스
- **Application** / **Service** = Containers on One host
  - 이를 위해 **Docker Compose** 를 사용하여 **하나의 호스트 머신에서 Containers 관리**
- **Orchestration** = Containers on Multiple hosts(Systems, MSA)
  - 이를 위해 **Docker Swarm** 를 사용하여 **다수의 호스트 머신에서 Containers 관리**

# Docker Engine

[<b>① Image 생성</b> 및 <b>② Container 구동</b> 모두를 담당하는 엔진](https://www.quora.com/What-is-the-difference-between-the-Docker-Engine-and-Docker-Daemon)이며 구성은 아래와 같습니다.

- 컨테이너 및 이미지 생성을 위한 유저의 입력을 받는 **Docker CLI**
- 컨테이너 구동을 위한 **Docker Daemon**

## Image 생성

Container 는 Image 기반으로 구동되기때문에 원하는 Container 구동에 앞서 원하는 Image 를 먼저 만들어야합니다. 이미지 생성에서 최종 컨테이너 구동까지는 세 절차로 이뤄집니다.

- Dockerfile - Dockerfile 작성

Dockerfile 로 원하는 Image 생성에 대한 설정(생성 규칙)을 여러 명령어로 작성합니다. 본 설정을 기반으로 이미지를 생성하고 생성된 이미지를 갖고 추후 컨테이너로 구동하게됩니다. 아래는 간단한 명령어 모음입니다.

> **FROM**: 기본 베이스 이미지를 정의합니다. 가져올 해당 이미지 URL 을 적으면 됩니다.<br>
> **ENV**: 이미지 내 환경변수를 설정합니다. 리눅스 터미널에서 `SET_VALUE=3` & `echo $SET_VALUE` 를 생각하면됩니다.<br>

> **RUN**: 실행할 Shell 명령어를 명시하면 **이미지 빌드 시점**에서 해당 명령어를 수행합니다.<br>
> **CMD**: 실행할 Shell 명령어를 명시하면 **이미지 빌드 완료 뒤 컨테이너가 정상 실행되었을때** 해당 명령어를 수행합니다.<br>

> **EXPOSE**: 외부에 열고싶은 Port 를 설정합니다. **Container 포트와 실제 Host 에서 노출할 포트를 연결**합니다.<br>
> **WORKDIF**, **ENTRYPOINT**: RUN/CMD 로 명시한 Shell 을 실행할 디렉토리 위치를 지정합니다.<br>
> **ADD**, **COPY**: 호스트의 디렉토리나 **파일을 이미지에 커밋**합니다.<br>
> **VOLUME**: 호스트의 디렉토리나 **파일을 이미지에 커밋하지 않고 컨테이너 디렉토리에 연결**합니다.<br>

> … 더 많은 명령어 및 상세 설명은 공식 Docker 문서를 참조하세요.

- Build (docker build) - 이미지 생성

`docker build` 명령어를 실행하면 가장 먼저, 작성되어있는 Dockerfile 를 Docker Daemon 에게 전달합니다. 그 후 Dockerfile 스크립트 내 매 명령어마다 실행하기 위한 컨테이너를 구동하고, 명령어가 성공적으로 수행된다면 해당 스냡샷으로 이미지를 생성합니다. 아래에서 예시로 살펴볼 `docker build` 수행 로그를 보면 **Docker 는 Dockerfile 내 각 명령어가 실행되는 컨테이너의 ID와 실행이 끝난다면 실행완료된 컨테이너의 스냅샷으로 생성한 이미지 ID 이 둘을 반환**하는걸 알 수 있습니다.

만약에 명령어 수행중에 실패하게 된다면 해당 명령어가 실행되는 컨테이너 ID에 쉘을 통해 접근하여 로그를 확인할 수 있습니다. 이처럼 중간에 반환되는 컨테이너 ID 를 통해 `docker build` 디버깅이 가능합니다. 그렇다면 Dockerfile 스크립트의 마지막 라인이 실행 완료된 컨테이너의 스냅샷이 최종적으로 우리가 생성할 이미지가 되는것입니다.

- **빌드의 시작은 Dockerfile 를 Docker Daemon 에 전달하면서 시작**됩니다.

Docker Daemon 은 Dockerfile 에서 FROM 명령어에 명시된 새로 생성할 이미지의 기반이 될 베이스 이미지를 가져옵니다.

```bash
$ docker build .

Sending build context to Docker daemon 10240 bytes

Step 1/3 : FROM base-image:1.7.2
Pulling repository base-image:1.7.2
 ---> e9aa60c60128/1.000 MB (100%) endpoint: https://my-own.docker-registry.com/v1/ // [!code highlight]
```

개인 Docker Registry 인 https://my-own.docker-registry.com/v1 에서 base-image:1.7.2 이미지를 가져왔습니다. 마지막 라인에 `e9aa60c60128` 는 다운받은 베이스 이미지에 Docker 가 할당한 ID 입니다. 다음으로 수행될 명령어는 이 이미지 기반으로 중간 이미지를 만듭니다.

- **그 다음 명령어는 이전에 생성된 중간 이미지를 다시 컨테이너로 구동하여, 명령어들을 수행한 뒤 스냅샷을 이미지로 반환**합니다.

```bash
Step 2/3 : WORKDIR /instance
 ---> Running in 9c9e81692ae9
Removing intermediate container 9c9e81692ae9
 ---> b35f4035db3f
```

바로 이전에 수행한 FROM 명령어의 결과로 `e9aa60c60128` 중간 이미지가 생성되었습니다. 본 이미지로 새 컨테이너 `9c9e81692ae9` 를 구동하였고, 그 내부에서 `WORKDIR /instance` 명령어를 수행한뒤, 수행 완료된 컨테이너를 내리고 그 스냅샷을 `b35f4035db3f` 이미지로 반환한것을 볼 수 있습니다.

- **Dockerfile 내 모든 Step 을 마친 뒤 마지막으로 생성한 스냅샷 이미지가 우리가 최종적으로 얻는 이미지가 됩니다.**

```bash
Step 3/3 : CMD echo Hello world
 ---> Running in 02071fceb21b
Removing intermediate container 02071fceb21b
 ---> f52f38b7823e

Successfully built f52f38b7823e
```

우리가 얻는 최종 이미지명(ID)을 `f52f38b7823e` 가 아닌 원하는 이름을 붙여주고 싶다면 tag 태그 옵션을 통해 이름을 붙여줄 수 있습니다. 예를 들면 `base-image:1.7.2` 로 새 이미지를 만들었으니 `custom-image:1.7.2` 로 이름 지어볼 수 있습니다.

- **Push** (`docker push`) - 이렇게 만든 이미지를 마지막으로 Docker Registry 에 저장합니다

## Container 구동

생성된 최종 Image 로 Docker Daemon 위에서 Container 구동합니다.

- **Pull** (`docker pull`) - 컨테이너를 구동하기 위해 저정된 이미지를 가져옵니다.
- **Execute** (`docker run`) - 가져온 이미지로 컨테이너를 구동합니다.

# Docker 이미지 설정 예시

상품 정보를 저장/조회하는 서비스를 제공하기 위해 **프론트엔드 서버는 nginx**(react.js) 로 **백엔드 서버는 tomcat**(java) 으로 서비스를 제공하려고합니다. 두 Application 들을 각각 Container 로 총 두 개의 Container 를 하나의 AWS EC2 서버 인스턴스에서 구동하려합니다.

## nginx 위한 Dockerfile 예

먼저 nginx image 설정을 보겠습니다. nginx 구동은 쉘 스크립트를 실행하게되는데 직접 만든 replace-hosts-and-run.sh 쉘을 이미지에 주입해서 알맞은 환경변수와 함께 수행하여 최종적으로 nginx 서버를 띄우는것을 목표로 하겠습니다.

```dockerfile
# 1. 기본 베이스 이미지를 가져옵니다. 프론트엔드 서버용 nginx 기본 이미지를 받습니다.
FROM http://docker-hub.aaronryu.com/nginx:1.8.0

# 2. nginx 웹 서버에서 다국어 지원을 위한 gettext 를 설치합니다.
RUN apk --no-cache add gettext

# 3. 현재 프로젝트 디렉토리 중 files/, build/, 쉘 스크립트를 이미지 내 지정한 디렉토리에 추가/붙여넣습니다.
ADD files/ /instance/program/nginx/conf
ADD build/ /instance/service/webroot/ui
ADD replace-hosts-and-run.sh /instance/program/nginx/replace-hosts-and-run.sh

# 4. 위 쉘 스크립트(replace-hosts-and-run.sh)에서 사용할 호스트 명 환경변수를 설정합니다.
ENV NGINX_HOST aaronryu.frontend.com

# 5. 로깅 등을 위해 nginx 컨테이너 내 아래 디렉토리를 호스트의 디렉토리에 연결합니다.
# (Container 가 아래 디렉토리에 하는 작업은 실제 호스트의 디렉토리에 반영됩니다.)
VOLUME ["/instance/logs/nginx"]

# 6. '이미지 완료 뒤'에 아까 복사해둔 아래 쉘 스크립트를 위 환경변수와 함께 실행(CMD)합니다.
CMD /instance/program/nginx/replace-hosts-and-run.sh
```

## tomcat 위한 Dockerfile 예

nginx 서버의 SPA 정적 페이지에서 조회 및 저장을 위해서는 그에 맞는 API 가 필요합니다. 이 API 들을 제공하기위한 tomcat 서버를 구동하겠습니다. Java 서버이기에 JVM 에 대한 설정을 추가하고, 외부에서 본 서버의 상태를 조회하기 위해 12345 포트를 열어두겠습니다.

```dockerfile
# 1. 기본 베이스 이미지를 가져옵니다. 백엔드 서버용 tomcat 기본 이미지를 받습니다.
FROM http://docker-hub.aaronryu.com/tomcat:8.0.0-jdk8

# 2. tomcat 의 구현은 spring boot 로 되어있습니다. 구동 시 production 프로파일 옵션을 주겠습니다.
ENV SPRING_PROFILE production

# 3. tomcat 은 Java 기반 서버이기에 JVM 메모리 옵션을 추가합니다.
ENV JVM_MEMORY -Xms2g -Xmx2g -XX:PermSize=512m -XX:MAxPermSize=512m

# 4. 현재 프로젝트 디렉토리내 저장되어있는 setenv.sh 을 이미지 내 tomcat 실행 쉘 파일에 추가/붙여넣습니다.
ADD setenv.sh ${CATALINA_HOME}/bin/setenv.sh

# 5. 현재 프로젝트 빌드가 완료된 뒤 생성된 war 파일을 모두 tomcat 실행 webapps 에 추가/붙여넣습니다.
COPY build/libs/*.war "${CATALINA_HOME}" /webapps/ROOT.war

# 6. 설정한 tomcat 서버 포트 8080 을 호스트의 12345 포트에 연결하여 외부에 노출합니다.
EXPOSE 8080 12345

# 7. 로깅 등을 위해 tomcat 컨테이너 내 아래 디렉토리들을 호스트의 디렉토리에 연결합니다.
# (Container 가 아래 디렉토리에 하는 작업은 실제 호스트의 디렉토리에 반영됩니다.)
VOLUME ["/instance/logs/tomcat", "/instance/logs/tomcat/catalina_log", "/instance/logs/tomcat/gc"]
```

위 예시로 살펴본 각각의 Dockerfile 은 각각 nginx 와 tomcat 프로젝트 내에 위치하게 됩니다. 이 두 컨테이너를 하나의 인스턴스에 동시에 띄우기 위해서는 Docker Compose 설정으로(예, .yml) 설정으로 각 컨테이너의 이미지를 묶어서 명시하면 됩니다.

---

- https://medium.com/@darkrasid/docker%EC%99%80-vm-d95d60e56fdd
- https://docs.docker.com/storage/storagedriver/#images-and-layers
- https://rampart81.github.io/post/docker_image/
- https://www.quora.com/What-is-the-difference-between-the-Docker-Engine-and-Docker-Daemon
- https://www.joyfulbikeshedding.com/blog/2019-08-27-debugging-docker-builds.html

---