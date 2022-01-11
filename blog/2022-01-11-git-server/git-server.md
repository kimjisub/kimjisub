---
slug: git-server
title: Git 원격 저장소 구축
authors: [김지섭]
tags: [git]
---

Github를 사용하지 않고 `Git`, `SSH`만을 이용하여 `Git` 환경을 구축하는 방법에 대해 설명하는 문서이다.

<!--truncate-->

## 개념

### Git Bare Repository

일반적으로 `.git/` 영역에 저장되는 코드의 변동사항에 대한 데이터만을 가지게 되는 레포지토리이다. 원격 저장소 구축을 할 때 사용된다. `Workspace` 영역이 없기 때문에 `checkout`을 할 수 없다. repository를 bare로 생성하는 방법은 다음과 같다.

```shell
git init --bare
```

## 서버 설정

### SSH 설정 (Windows)

#### Path 등록

`sysdm.cpl`에 들어가서 아래 내용 path에 등록하기

```
C:\git\bin
C:\git\usr\bin
```

#### sshd 실행

윈도우 추가 기능 설치를 통하여 ssh 서버인 sshd를 실행할 수 있지만, git에서 제공하는 sshd를 사용하여 서버를 열어보겠다.

```shell title="ssh 키 설정"
ssh-keygen -t rsa -f C:\git\etc\ssh\ssh_host_rsa_key
ssh-keygen -t ecdsa -f C:\git\etc\ssh\ssh_host_ecdsa_key
ssh-keygen -t ed25519 -f C:\git\etc\ssh\ssh_host_ed25519_key
```

```text title="C:\user\User.bashrc"
export PATH="/mingw64/bin"
```

```text title="sshd 실행"
C:\git\usr\bin\sshd.exe
```

## 클라이언트 설정

### git clone

클라이언트 PC에서 다음과 같은 명령어로 clone을 할 수 있다

```shell
git clone <사용자>@<서버 주소>:<경로>/<이름>.git

git clone User@git.kimjisub.me:kimjisub/test.git
```
