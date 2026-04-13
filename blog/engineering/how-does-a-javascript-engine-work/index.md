---
title: "Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure"
category: ["Language", "Javascript"]
created: 2020-08-26T17:22:10.000Z
updated: 2021-01-30T16:21:33.148Z
deck: 자바스크립트는 단순한 인터프리터 언어를 넘어 V8 엔진과 같은 고성능 엔진을 통해 현대적인 방식으로 실행된다. 변수 선언이 최상단으로 끌어올려지는 듯한 '호이스팅'과 함수가 종료되어도 상태를 기억하는 '클로저'의 마법이 엔진 내부에서 어떻게 구현되는지 그 실체를 파헤쳐 본다.
abstract: 자바스크립트 엔진의 두 단계 실행 과정인 '컴파일'과 '실행'을 중심으로 호이스팅의 발생 원리를 이해한다. 또한 실행 컨텍스트와 렉시컬 스코프의 관계를 통해 클로저가 메모리에 유지되는 메커니즘을 학습하고, 가비지 컬렉션(GC) 관점에서의 클로저 활용 시 주의사항을 살펴본다.
keywords: 자바스크립트 엔진, V8 엔진, 호이스팅, 클로저, 실행 컨텍스트
description: 자바스크립트 V8 엔진의 동작 원리를 통해 호이스팅과 클로저의 개념을 단순 암기가 아닌 엔진의 컴파일 및 실행 메커니즘 관점에서 심도 있게 설명합니다.
---

# 자바스크립트

자바스크립트는 웹 페이지의 세 요소중 하나입니다.

- **HTML**: 웹 페이지(문서) 포맷을 정의하는 마크업 언어
- **CSS**: 웹 페이지(문서)의 디자인 요소에 대한 언어
- **JS** (Javascript): 웹 페이지(문서)와 사용자 사이의 interaction 이벤트에 대한 모든 처리

자바스크립트는 일반 프로그래밍 언어와 동일하게 함수 선언 및 호출를 통해 바로 동기적(Synchronous)으로 실행할수도 있고, 콜백을 통해 특정 이벤트 시점에 비동기적(Synchronous)으로 수행하게 만들수도 있습니다. 실행을 위해서는 개발자가 작성한 자바스크립트 언어를 실행 가능한 언어로 변형하여 실행, 실행 순서 및 메모리를 관리하는 엔진이 필요합니다.

> 하나의 브라우저는 **HTML/CSS 엔진** + **자바스크립트 엔진**으로 구성되어있습니다.

흔히 알고 있는 Chrome, Internet Exploerer, Safari 등 다양한 웹 브라우저마다 각자 자신들만의 HTML/CSS/JS 엔진를 갖고 있습니다. 자바스크립트 엔진 중 대표적인것은 Chrome 브라우저와 NodeJS 에서 사용되고있는 V8 가 있습니다. 앞으로 설명할 자바스크립트 엔진 및 런타임은 이 V8 기준으로 설명할것입니다. 잠깐 앞으로 계속 언급될 자바스크립트 엔진과 자바스크립트 런타임 용어를 확실히 짚고 넘어가겠습니다. 더 상세한 설명은 소제목 자바스크립트 엔진 및 런타임 에서 하겠습니다.

> **자바스크립트 런타임**은 자바스크립트 동작을 위해 필요로 하는 **자바스크립트 엔진**을 포함한 **API 및 기능의 집합**입니다.<br>
> **자바스크립트 엔진**은 좁은 의미로 자바스크립트 인터프리팅 역할을 전담하는것으로 **Java 의 JVM 으로 이해하면 됩니다.**

예를 들면 **V8 자바스크립트 엔진**기반의 자바스크립트 런타임으로 우리가 사용하는 Chrome 이 동작되는것입니다.

# 자바스크립트 = 인터프리트 언어

> 자바스크립트는 스크립트 언어이자 엔진을 통해 처리되는 **인터프리트 언어**입니다.<br>
> 다만, **컴파일 과정**을 갖고 있습니다. 이에 대해 설명하겠습니다.

자바스크립트 엔진은 일반적인 쉘 스크립트가 한 라인씩 바로 실행되는 인터프리트 언어와는 조금 다른 실행 구조를 갖고있습니다. [먼저, 실행할 전체 함수를 실행 직전에 간단히 변수 및 함수 선언들만 스캔하는 Ⓐ JIT 컴파일 과정을 거쳐, 그 후 Ⓑ 수행 과정의 사이클로 실행](https://dev.to/genta/is-javascript-a-compiled-language-20mf)됩니다. 여기서 [Ⓐ JIT (Just-in-Time) 컴파일 과정은 실제 우리들이 흔히 알고있는 C++, Java 와 같은 컴파일 언어에서 중간코드를 만드는 AOT (Ahead-of-Time) 컴파일 과정과는 다릅니다.](https://dev.to/deanchalk/comment/8h32) 자바스크립트를 인터프리트 언어라고 알고있었는데 좀 놀랍죠. [이렇게 자바스크립트 엔진에 단순히 컴파일 과정이 있다는 사실만으로 자바스크립트를 컴파일 언어로 언급하기도 합니다만 엄연히 기존 컴파일 언어의 정의와 다르고](https://gist.github.com/kad3nce/9230211#compiler-theory), [자바스크립트 엔진은 함수 실행 시점에 컴파일을 진행하므로 인터프리트 언어입니다.](https://dev.to/deanchalk/comment/8h32)

> 자바스크립트 엔진은 **Ⓐ JIT 컴파일 과정**과 **Ⓑ 수행 과정** 이렇게 두 개로 나뉩니다.<br>
> 결론적으로 **자바스크립트는 컴파일 과정을 가진 인터프리트 언어**로 요약할 수 있지 않을까합니다.

# 자바스크립트 엔진 및 런타임

자바스크립트 런타임은 크게 2 개의 구성요소로 나눠질 수 있고, 개별적으로는 5 개로 나누어 볼 수 있습니다.

- 자바스크립트 엔진 = **① Heap** + **② Stack** (Call stack)
- **③ Web APIs** + **④ Callback Queue** + **⑤ Event Loop**

자바스크립트 엔진은 **① Heap** 그리고 **② Stack** 만을 의미하며 싱글 스레드로 모든 코드를 수행합니다. 자바스크립트의 비동기를 학습할때 배우는 **③ Web APIs**, **④ Callback Queue**, **⑤ Event Loop** 들은 정확히는 자바스크립트 엔진의 구성요소가 아닙니다. 자바스크립트 엔진이 싱글 스레드로 모든 코드를 수행한다면 동기적 실행밖에 안될텐데 어떻게 비동기를 지원한다는 것일까요? 비동기 지원을 위해 바로 자바스크립트 런타임에서 ③, ④, ⑤ 세 요소를 추가한것입니다.

자바스크립트 엔진의 (2) Stack 은 일반 프로그램 언어들의 Stack 과는 다른데요. 타 프로그램 언어들은 함수 실행에 따라 Call stack 에 각 로컬 함수들의 변수 등의 Context 정보들을 다 같이 쌓습니다. 로컬 함수에만 국한된 정보들을 갖는다는 이유로 Context 를 Scope 라고도 부릅니다. 반면, 자바스크립트 엔진도 Call stack 에 함수 호출 순서를 적재합니다만, 변수 및 함수 선언과 할당 정보는 Heap 에 따로 저장히여 Call Stack 에는 본 Heap 에 대한 포인터만 갖고 있습니다. 구체적으로 정리하면 아래와 같습니다.

- 자바스크립트 엔진
  - **① Heap**: 각 함수 별 선언 및 할당되는 모든 변수 및 함수를 적재하는 메모리 영역
  - **② Stack** (Call Stack): 함수 실행 순서에 맞게 위 Heap 에 대한 포인터 적재 및 실행
- 비동기 지원
  - **③ Web APIs**: [기본 자바스크립트에 없는 DOM, ajax, setTimeout 등의 다양한 함수들 제공](https://developer.mozilla.org/ko/docs/Web/API)
    - 브라우저나 OS 등에서 C++ 처럼 다양한 언어로 구현되어 제공
  - **④ Callback Queue**: 위 Web APIs 에서 발생한 콜백 함수들이 차곡차곡 여기에 적재
  - **⑤ Event Loop**: 위 Callback Queue에 적재된 함수를 Stack 로 하나씩 옮겨서 실행되도록 하는 스레드

# 자바스크립트 엔진 실행 과정

자바스크립트 엔진은 **Ⓐ JIT 컴파일 과정**과 **Ⓑ 수행 과정** 이렇게 두 개로 나뉩니다.

## Ⓐ Compilation Phase

매 함수 실행 시 (자바스크립트 첫 실행 함수는 `main()` 입니다.) ASTs 생성 및 바이트코드로 변경하고 JIT 컴파일 기법(바이트코드 캐싱을 통해 불필요한 컴파일 시간을 줄이는것)을 위해 프로파일러로 함수 호출 횟수를 저장/추적합니다. 우리가 기억하면 될 것은 본 과정에서 <b>변수의 ‘선언’</b>(선언과 할당 중) 그리고 <b>함수의 ‘선언’을 Heap 에 적재한다는것</b>입니다.

> 자바스크립트 <b>변수의 ‘선언’</b>은 `var a` 입니다. (`a = 5` 는 ‘할당(Assignment)’입니다.)

<br>

> 자바스크립트 <b>함수의 ‘선언’</b>은 `function a() {}` 입니다.

<br>

> Ⓐ Compilation Phase 에선 변수 및 <b>함수의 ‘선언(Declaration)’만 추출하여 Heap 에 적재</b>합니다.<br>
> 변수와 함수의 선언을 자바스크립트 실행 이전에 컴파일로 저장하여 실제 실행 시 변수와 함수 선언 여부를 검색합니다.

예를 들어 아래 자바스크립트 파일을 처음 실행하게 되면 파일 전체에 컴파일 과정을 수행하게됩니다.

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g();
  var e;
}

f(1);
```

1. 자바스크립트 첫 실행을 위한 main() 함수의 **Global Scope (window) 영역을 Heap 에 생성**합니다.

```
# Global Scope (window)
- 
- 
```

2. 변수 선언 `var a` 을 찾아서 Global Scope (window) 영역에 **a 를 적재합니다.**
3. 변수 할당 `b = 1` 은 할당이므로 본 영역에 **b 는 적재하지 않습니다.**

```
# Global Scope (window)
- a =
- 
```

4. 함수 선언 `function f(z) {}` 을 찾아서 Global Scope (window) 영역에 **f 를 적재합니다.**
5. 함수 적재시엔 `f` 함수의 바이트코드(blob)에 대한 포인터값을 함께 적재합니다.

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

자바스크립트 코드를 첫번째 라인에서 20번째 라인까지 컴파일 과정을 마치면 Heap 구성은 마지막과 같습니다.

## Ⓑ Execution Phase

<b>변수의 ‘할당(Assignment)’</b>과 <b>실제 함수를 호출 및 실행</b>합니다.

> 자바스크립트 <b>변수의 ‘할당’</b>은 `a = 1` 입니다.<br>
> `a = 1` 할당 시 이전 컴파일 과정에서 선언된 변수 a 가 있는지 확인합니다.<br>
> 만약 존재하지 않는다면 `a` 변수 ‘선언’과 동시에 ‘할당’하여 적재합니다.

<br>

> 자바스크립트 <b>함수의 ‘호출 및 실행’</b>은 `a()` 입니다.<br>
> `a()` 실행 시 첫번째로, 이전 컴파일 과정에서 선언된 함수 `a()` 가 있는지 확인합니다.<br>
> `a()` 실행 시 두번째로, Heap 에는 새 함수를 위한 Local Execution Scope 영역을 생성하고,<br>
> Call Stack 에는 생성된 Heap 에 대한 포인터를 갖는 함수 `a()` 정보를 적재합니다.<br>
> `a()` 실행 시 마지막으로, 컴파일을 수행하여 본 함수 내 변수 및 함수를 위 Local Execution Scope 영역에 적재합니다.

<br>

> Execution Phase에선 변수의 ‘할당(Assignment)’값들을 Heap 에 적재하고 함수는 호출 및 실행합니다.

매 함수 호출때마다 스택에 함수 내 변수 및 함수를 같이 적재하는 스택 베이스 언어과 달리 자바스크립트는 스택에는 함수 호출 순서와 실제 변수 및 함수 정보들은 Heap 에 대한 포인터를 갖습니다. Heap 에 함수 `a()` 를 위한 Local Execution Scope 는 `a()` 함수가 호출되기 이전에 Heap 에 존재했던 Global Scope (window)에 대한 포인터를 갖고있어서, 엔진 내에서 아래와 같은 처리가 가능합니다.

- `a()` 함수 내에서 `a = 1` 변수 할당 시 먼저 Local Execution Scope 에 `a` 변수의 선언을 찾고,<br>
  존재하지 않는다면 이전 Global Scope 로 돌아가 검색할 수 있습니다.
- `a()` 함수 실행이 끝나게 되면 Call Stack 을 통해 현재 Heap 영역을 Global Scope 로 다시 되돌립니다.

위에서 예시로 살펴본 자바스크립트 파일에 컴파일 과정을 마친 뒤 수행 과정은 아래와 같이 진행됩니다.

6. 앞선 컴파일 이후 아래의 Heap 을 갖고 다시 자바스크립트 파일 코드의 맨 첫번째 라인에서 실행이 시작됩니다.

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

7. 변수 할당 `a = 2` 을 찾아서 Global Scope (window) 영역에 변수 `a` 존재 여부를 확인합니다.
8. 변수 `a` 가 존재하므로 해당 `a` 에 `2` 를 할당합니다.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
```

9. 변수 할당 `b = 1` 을 찾아서 Global Scope (window) 영역에 변수 `b` 존재 여부를 확인합니다.
10. 변수 `b` 가 선언되어있지 않아 `b` 선언 및 `1` 을 할당합니다.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1
```

1.  함수 호출 `f(1)` 을 찾아서 Global Scope (window) 영역에서 `f()` 선언 여부를 확인합니다.
2.  함수 `f()` blob 컴파일 및 수행을 위해 Heap 에 새 Local Execution Scope 영역을 생성합니다.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for f()
- (hidden) A pointer for previous scope (= Global Scope (window))
- 
- 
```

`f(1)` 함수 실행 시 새로이 생성된 Local Execution Scope에 다시 Compilation Phase 과정을 통해 변수와 함수를 적재하게 되고 Execution Phase 과정을 수행하게 됩니다. 또 `f(1)` 함수 내부에 또 다른 함수가 있다면 이 과정을 계속해서 재귀적으로 반복합니다.

13. 함수 `f()` 의 **Ⓐ Compilation Phase** 과정을 마치면 아래와 같이 됩니다.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z = 
- d = 
- e = 
```

14. 함수 `f()` 의 **Ⓑ Execution Phase** 과정을 마치면 함수 `f()` 내 변수 할당 및 함수 `g()` 의 Scope 가 생성되게 됩니다.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 3

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z = 1
- d = 6
- e = 1
- c = 4

# Local Execution Scope for function g()
- (hidden) a pointer for previous scope (= Local Execution Scope for function f())
- e =
```

# 자바스크립트 엔진 특성

## Function-level scope: `var`

**자바스크립트 실행은 결국 함수에 따라 Ⓐ 컴파일, Ⓑ 수행이 재귀적으로 이뤄집니다.** 처음 자바스크립트 실행 시 main() 함수에 대한 Ⓐ, Ⓑ 처리를 시작으로 내부에 새로운 함수 호출이 일어나면 새 함수에 대한 Ⓐ, Ⓑ 처리 그리고 또 내부 함수 호출이 있다면 그 함수에 대한 Ⓐ, Ⓑ … 이런식으로 처리를 반복하게 됩니다.

> 특정 함수 내 변수 var 의 선언은 본 함수 Ⓐ 컴파일에 정의되기 때문에 변수 `var` 의 scope 는 function-level 이 됩니다.

if, for 문과 같은 block-level(`{}`) 단위 변수를 위해 ES6 스펙에선 <b>Block-level scope: `const`, `let`</b> 이 새로 소개되었습니다.

## Scope Chain

자바스크립트 엔진 실행 과정에서 살펴보았듯 특정 함수에 대한 Ⓑ 수행 단계에서 변수 할당 시 본 함수의 Heap 영역에 변수 선언이 되어있는지 먼저 검사하게 됩니다. **만약 본 함수 내 변수가 선언되어있지 않았다면 해당 함수의 Heap 에서는 변수 선언을 찾을 수 없게됩니다. 이때 해당 함수가 호출되기 이전의 함수로 (hidden) A pointer for previous scope 를 통해 올라가면서 해당 함수 Heap Scope 에 변수가 선언되었는지 확인합니다.** 어떠한 함수에서도 변수 선언이 되어있지 않다면 가장 처음에 호출된 main() 함수까지 올라가면서 검색하게 됩니다. **함수 호출 스택의 역순으로 가장 처음의 `main()` 함수까지 각 함수 Heap Scope 에 변수 선언 존재여부를 연쇄적으로 Chaining 하며 찾기때문에 이를 Scope Chain 이라고 부릅니다.**

## Variable Hoisting

Ⓐ 컴파일 단계에서 변수를 선언을 먼저하고, 그 다음 Ⓑ 수행 단계에서 변수를 할당하기 때문에 같은 function-level 이라면 아래와 같이 변수 선언과 할당을 나누어서 하더라도 자바스크립트 엔진에서는 변수 선언이 먼저 된 것으로 처리됩니다.

```js
a = 10
var a;
```

```
# Global Scope (window)
- a = 10
```

위 예시처럼 var a 선언이 같은 function-level 내에서 최상단에 ‘말려올라간것’처럼 수행되기도 하지만, 만약 함수 내 변수가 선언되어있지 않았다면 Scope Chain 을 통해 `main()` 함수까지 올라가면서 변수 선언을 찾습니다. 최종적으로 `main()` 함수 Heap Scope 에도 선언되어있지 않다면 `main()` 함수 영역에 변수를 선언해주게 됩니다. `main()` 에서 호출한 어떤 함수이든 Scope Chain 을 통해 방금 선언해준 변수를 바라볼테니 이는 전역 변수인것입니다. (`main()` 의 Heap Scope 영역 명칭은 Global Scope (window)이기도 합니다.) <b>특정 함수내에 변수를 할당하였지만 본 변수는 어느 함수에도 존재하지 않는 변수이기에 `main()` 함수까지 ‘말려올라가서’ 전역 변수를 선언한것이 됩니다. 변수 선언이 ‘말려올라갔다’는 의미에서 이 모든 경우를 Variable Hoisting 이라고 표현합니다.</b>

## Variable Shadowing

특정 함수의 Heap Scope 에 변수 선언이 되어있다면 해당 변수에 대한 변수 할당은 현재 함수 Heap Scope 에 선언되어있는 변수에 대입됩니다. 만약에 해당 함수를 호출하는 이전 함수에 해당 변수와 똑같은 명칭의 변수가 선언되어있다고 할지라도 현재 함수 Heap Scope 에 이미 존재하기때문에 이전 함수의 Heap Scope 까지 Scope Chain 할 필요가 없습니다. **이전 함수에 같은 명칭의 변수가 있다고하더라도 현재 함수는 그 존재를 알 수도 알 필요도 없기 때문에 이를 Variable Shadowing 이라 부릅니다.**

## Garbage Collection

함수 직접 수행이 끝나면 Stack 에서 수행 완료된 함수의 정보를 없애면서 Heap 메모리 내 수행 완료된 함수의 Heap Scope 도 없애게 됩니다. 메모리 청소의 의미로 Garbage Collection 이라고 부릅니다. 전체 자바스크립트 파일 실행이 끝나게되면 가장 마지막으로 main() 함수의 Global Scope(Window) 도 사라지게 됩니다. Reference Count 를 통한 Garbage Collection 를 하는 스위프트 언어도 있지만 **자바스크립트는 단순히 함수(포인터)의 Reachability 를 기반으로 Garbage Collection 를 수행**합니다. 함수 직접 수행이 아닌 함수 수행을 변수에 할당한 경우엔 함수 수행이 끝났다고 하더라도 할당된 변수로 또 함수 수행이 가능하기 때문에 본 함수에 대한 Garbage Collection 를 안하는 경우가 존재하는데 바로 아래서 설명할 Closure 개념입니다.

## Closure

자바스크립트 엔진 실행 설명시 다뤘던 예제에서 `function f` 를 바로 실행하지 않고 `var myFunction` 를 선언하여 그에 할당해보았습니다.

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g;
  var e;
}

var myFunction = f(1); // 새로 추가된 코드
myFunction();
```

함수 호출을 변수에 할당하게 되면 함수의 호출은 일회성으로 호출이 끝나면 사라지는것이 아니라 `myFunction` 이란 변수를 통해서 계속해서 반복 호출이 가능하기 때문에 `f` 함수 호출을 위해 생성된 `f` 함수의 Heap Scope 는 지워질 수 없습니다. 조금 쉽게 생각하자면 `f` 함수 Heap Scope 에는 `f` 함수 수행을 위해 넘긴 파라미터 값 `1` 도 들고있기 때문에 Heap Scope 를 Garbage Collection 할 수 없는것입니다. 이처럼 함수 호출을 변수에 할당하게 되면 `f` 함수의 Heap Scope 와 `f` 를 호출한 함수의 Heap Scope 가 파라미터 `1` 을 기준으로 강하게 묶여있기 때문에 `f` 함수 실행이 끝났음에도 불구하고 `f` 함수의 Heap Scope 가 Garbage Collection 되지 않습니다.

Closure 는 함수의 Heap Scope 와 해당 함수를 호출하는 함수의 Heap Scope 를 연결하는것으로, 함수 호출이 끝나더라도 Scope 는 여전히 해당 함수를 호출한 함수의 Scope 에 ‘갇혀있는’ 개념입니다.

---

- https://youtu.be/QyUFheng6J0
- https://www.quora.com/Is-JavaScript-a-compiled-or-interpreted-programming-language
- https://medium.com/@almog4130/javascript-is-it-compiled-or-interpreted-9779278468fc
- https://blog.usejournal.com/is-javascript-an-interpreted-language-3300afbaf6b8
- https://youtu.be/QyUFheng6J0?t=435
- https://dev.to/genta/is-javascript-a-compiled-language-20mf
- https://dev.to/deanchalk/comment/8h32
- https://gist.github.com/kad3nce/9230211#compiler-theory
- https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf
- https://developer.mozilla.org/ko/docs/Web/%EC%B0%B8%EC%A1%B0/API
- https://medium.com/@antwan29/browser-and-web-apis-d48c3fd8739

---