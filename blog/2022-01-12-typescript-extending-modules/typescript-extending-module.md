---
slug: typescript-extending-module
title: Typescript 모듈 확장
authors: [김지섭]
tags: [typescript]
---

Typescript에서 이미 존재하는 모듈에 함수를 추가하는 방법이다.

<!--truncate-->

```typescript
declare global {
  interface Array<T> {
    randomOne(): T;
  }
}

Array.prototype.randomOne = function randomOne() {
  const randomIndex = Math.floor(Math.random() * this.length);
  return this[randomIndex];
};
```
