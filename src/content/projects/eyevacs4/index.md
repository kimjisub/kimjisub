---
title: "Eyevacs4"
date: "2023-08"
github: ""
url: "https://www.eyevacs.com"
---

# Eyevacs4

아파트 통합 관리 솔루션

![image](https://prod-files-secure.s3.us-west-2.amazonaws.com/a4a3f1ab-c3ba-4b20-958a-5c6f33136e58/8e545173-caef-4621-8508-be31395770c2/Untitled.png)

![image](https://prod-files-secure.s3.us-west-2.amazonaws.com/a4a3f1ab-c3ba-4b20-958a-5c6f33136e58/0b96d999-1044-40af-9ac6-66a5beb52e77/Untitled.png)

![image](https://prod-files-secure.s3.us-west-2.amazonaws.com/a4a3f1ab-c3ba-4b20-958a-5c6f33136e58/23dc8135-6e45-4310-a314-d34b08184de3/Untitled.png)

![image](https://prod-files-secure.s3.us-west-2.amazonaws.com/a4a3f1ab-c3ba-4b20-958a-5c6f33136e58/174731af-8043-40ef-8cc9-7d1f36c6760e/Untitled.png)

- React Native Codepush 적용을 통해 배포 시간 1000%가량 단축
- Gitflow 적용을 통한 개발 흐름에 중단되지 않는 hotfix 등의 전략 적용
- Open API Spec을 활용하여 API 변경사항 트래킹 및 인터페이스 Auto Create 되도록 하여 실수 방지
- 자사의 다른 제품군과 계정 통합 작업 진행
- AWS CloudWatch 비용 최적화
- 결제 관련 Micro Service Replica 가능하도록 구축
- 클라우드 환경에서 동작되던 인프라를 고객사의 요구사항에 맞게 Bare metal 에 직접 구축
- replica 불가능한 서비스 replica가 가능하도록 Architecture Migration
- 미국 현장 납품을 위한 Language i18n, timezone 시스템
- ECS 비용 최적화
- MSA 환경에서 권한 인증 시스템
- IPC
---

![image](attachment:d9d9a241-9e00-490f-bb6b-6e1bbdd1634b:CleanShot_2025-06-11_at_10.50.01.png)

---

#### ✅ 핵심 문제

- IoT 장비(Arduino, ESP32 등)는 TLS 통신을 위해 CA 인증서를 펌웨어에 포함함.
- 로그 수집 및 메트릭 수집 기능 포함
- CA 인증서가 만료되면 TLS 연결 실패 → OTA 펌웨어조차 내려받지 못함 → 벽돌 위험
---

#### ✅ 일반적 접근

- CA를 갱신한 펌웨어를 OTA로 배포하여 문제 해결
- 하지만 TLS 실패로 OTA 자체가 불가능해지면 순환 참조 발생
---

#### ✅ 대응 전략

---

#### ✅ 인증서 체인 교체 시 서버 대응

- 서버는 동시에 여러 체인을 제공할 수 있음
- 이를 크로스서명(chain switching) 이라고 함
- Nginx/Apache에서는 fullchain.pem으로 구성 가능
- AWS ACM은 제한적이라, 프록시 서버가 필요할 수도 있음
---

#### ✅ 결론

- CA 만료 = OTA 단절 위험이므로,
- 가장 현실적인 조합:
---

- 구형 클라이언트: 이전 루트 CA 체인 사용
- 신형 클라이언트: 신규 루트 CA 체인 사용
- OTA fallback 경로 설계 + 인증서 교체 방식 관리가 매우 중요함
- TLS 보안 유지하면서 OTA만 fallback 허용 (HTTP or 인증 생략)
- 무결성 검증(SHA256 or ECDSA) 반드시 적용
- 서버는 다중 체인 구성하여 구형/신형 동시 대응
