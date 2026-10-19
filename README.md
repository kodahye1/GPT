# AI Model Manager

Figma의 AI Model Manager를 React + TypeScript + Vite로 구현한 웹 데모입니다. 서버/API 연결 없이 브라우저에서 설치와 저장 공간을 시뮬레이션합니다.

공개 사이트: https://ai-model-manager-virid.vercel.app/

GitHub 저장소: https://github.com/kodahye1/GPT . main 브랜치에 변경 사항을 올리면 Vercel이 자동 재배포합니다. 배포 절차는 [DEPLOYMENT.md](DEPLOYMENT.md)에 있습니다.

## 실행

Windows에서 `start.cmd`를 더블 클릭하면 필요한 패키지를 설치하고 브라우저를 엽니다. Node.js 24 이상이 필요합니다. 현재 작업 환경에는 패키지가 이미 설치되어 있습니다.

터미널에서 실행할 수도 있습니다.

```powershell
git clone https://github.com/kodahye1/GPT.git ai-model-manager
cd ai-model-manager
npm ci
npm run dev
```

브라우저 주소: http://127.0.0.1:5173/

종료하려면 실행한 터미널에서 `Ctrl+C`를 누릅니다. 5173 포트를 이미 사용하고 있으면 기존 실행 창을 종료한 뒤 다시 실행합니다. 다른 포트로 실행하려면 `npm run dev -- --port 5174`를 사용합니다.

## 데모 사용

1. 접속하거나 새로고침하면 AI Model List의 첫 모델인 `MiniMax H3`가 기본 선택되고, 모든 Target IP의 하단 내용은 접힌 상태로 시작합니다. 모델을 클릭하면 상세 내용과 각 IP의 `Installed` / `Not Installed` 상태가 바뀝니다. 같은 모델을 다시 클릭하면 선택을 해제하고 펼친 내용을 접습니다. 상세 설명은 마지막으로 확인한 모델을 유지합니다.
2. IP 주소 왼쪽 원을 체크하면 대상을 선택하고 해당 IP의 하단 목록을 펼칩니다. 체크를 해제하면 목록을 다시 접습니다. 현재 사용량·여유 공간과 `Selected Model`의 추가 용량이 표시됩니다. 여러 IP를 선택할 수 있으며, 모델을 바꿔도 체크하지 않은 IP는 접힌 상태를 유지합니다.
3. `Install`을 누르면 약 8초 동안 진행률과 설치 애니메이션이 표시됩니다. 완료되면 해당 IP만 설치 상태와 저장 공간이 갱신됩니다.
4. 기본 `MiniMax H3`는 초기 두 IP에 설치되어 있지 않습니다. IP를 체크하고 Install을 누르면 설치를 체험할 수 있습니다. `LTX-2.5`를 선택하면 첫 번째 IP는 Installed, 두 번째 IP는 Not Installed로 서로 다른 상태를 확인할 수 있습니다.
5. 설치 상태 줄의 화살표로 IP별 목록을 따로 접고 펼칠 수도 있습니다. 모델 선택을 해제하면 진행률을 포함한 하단 내용이 접히며, 시작한 설치 작업은 계속 진행됩니다.
6. 저장 공간이 부족하거나 이미 설치된 경우 설치할 수 없습니다. 설치 중 쓰레기통 버튼은 취소, 설치 완료 후에는 선택한 모델의 제거 기능입니다.
7. 상단 새로고침 아이콘으로 모든 데모 데이터를 초기화합니다. 검색, IP 추가·수정, 전체 화면 버튼도 사용할 수 있습니다.

설치가 끝난 데이터는 브라우저의 Local Storage에 저장됩니다. 새로고침해도 완료된 설치 상태는 유지됩니다. 설치 도중 새로고침하면 진행 중인 작업은 취소되며 용량을 차감하지 않습니다. 저장 기능을 사용할 수 없는 브라우저에서도 현재 탭의 데모는 동작합니다.

왼쪽 `Usage Logs`, `Points & Billing`, `Invoices`는 원본 디자인을 재현한 표시 항목입니다. 별도 페이지나 결제 기능은 포함하지 않습니다. 다른 카테고리는 해당 카테고리의 데모 모델만 표시합니다.

## 디자인과 데이터

- 원본: https://www.figma.com/design/3wKOlH9rTRnJWxk47OeuSR/Untitled?node-id=1-27
- 2026년 10월 19일 확인한 수정본의 Idle / Ready to Install / Installing 프레임을 기준으로 구현했습니다. 수정된 New 배지, IP 카드의 글자 크기와 간격, Model Details의 Features & recommendations 구성을 반영했습니다.
- 1920×1080에서 패널의 좌표와 크기를 원본에 맞췄습니다. 작은 데스크톱 화면에서는 같은 비율로 축소하며 패널별로 스크롤합니다.
- Figma 연결 도구의 접근 오류 때문에 브라우저에서 확인한 원본 레이어 및 PNG 기준 이미지를 사용해 치수·색상·폰트를 확인했습니다. 원본 SVG 아이콘과 카드 배경을 사용합니다. MiniMax H3, Wan 2.2, LTX-2.5는 같은 강조 카드 스타일을 사용하며 그라데이션은 카드 전체 크기에 맞춰 늘어납니다.
- 최신 AI Model List는 MiniMax H3 → Wan 2.2 → LTX-2.5 → LTX-2.3 → LTX-2.3 Fast → Fast H3 → LongCat Avatar → MOVA 순서입니다. 원본의 빨간 New 배지, 연한 상태 배지와 간격을 반영하고, 요청에 따라 LTX-2.5를 같은 강조 카드로 유지했습니다. 화면에서 빠진 모델도 기존 IP 설치 목록과 저장 데이터를 보존하기 위해 내부 카탈로그에는 유지합니다.
- Model Details의 설명과 이미지는 각 모델의 공식 GitHub 저장소에서 확인했습니다. 주요 특징과 추천 용도, 모델별 예제 이미지와 `Released Date`를 표시합니다. 화면의 GitHub 링크는 제거했으며 자료 출처와 출시일 근거, LTX 변형의 대응 관계는 [SOURCES.md](SOURCES.md)에 기록했습니다.
- 폰트도 패키지에 포함되어 앱 실행 중 외부 폰트 서버나 Figma 에셋 주소에 의존하지 않습니다.
- IP 주소·모델 크기·설치 목록은 데모 데이터입니다. 원본의 예시 저장 공간 수치에는 합계 불일치가 있어 실제 사용량과 여유 공간은 일관된 계산값으로 표시합니다.

## 검증과 빌드

```powershell
npm test
npm run build
npm run preview
```

`npm test`의 테스트 8개는 IP별 설치 분리, 중복 요청, 취소, 제거 후 용량 반환, 용량 부족, 여러 IP 동시 설치, 저장 데이터 검증을 확인합니다. 기존 버전은 브라우저에서 모델별 상세 전환, 선택 해제 시 접힘, IP 선택 시 예상 용량, 설치 애니메이션과 완료 후 용량 갱신, 새로고침 후 설치 상태 유지를 확인했습니다. 최신 목록 수정은 React의 실제 렌더링으로 8개 카드의 순서, 공통 강조 스타일, 첫 모델 기본 선택, IP 기본 접힘, 출시일 표시를 확인했습니다. 목록 밖의 CSS와 기존 상세 내용 및 설치 로직이 동일함도 대조했습니다. 이번 수정 후 앱 내 브라우저가 초기 탐색에서 멈추거나 충돌하여 최종 브라우저 화면 대조는 완료하지 못했습니다. 빌드 결과는 `dist/`에 생성됩니다. 프로덕션 빌드 미리보기 주소는 http://127.0.0.1:4173/ 입니다.

소스는 `src/`, 디자인 에셋은 `public/assets/`, GitHub 예제 이미지는 `public/assets/models/`, 데모 모델과 IP는 `src/data.ts`, 상세 자료는 `src/modelProfiles.ts`, 설치 시뮬레이션은 `src/installation.ts`에 있습니다.
