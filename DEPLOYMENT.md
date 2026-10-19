# AI Model Manager — Vercel 배포 안내

## 준비된 상태

- 기존 `src/`, `public/`, UI 디자인, 애니메이션과 설치 시뮬레이션은 원본과 동일합니다.
- `vercel.json`: Vite, `npm ci`, `npm run build`, `dist`와 SPA 경로 재작성 설정.
- `package.json`과 `.nvmrc`: Node.js 24 지정.
- `package-lock.json`: 설치 버전 고정.
- `.gitignore`와 `.vercelignore`: 로컬 의존성, 빌드 결과, 인증 연결 정보와 환경 파일 제외.
- 환경 변수와 백엔드 서버는 필요하지 않습니다.

## 실제 배포 결과

- 공개 Production URL: https://ai-model-manager-virid.vercel.app/
- Vercel 프로젝트: `dahye14/ai-model-manager`
- GitHub 저장소: https://github.com/kodahye1/GPT
- 배포 상태: `READY` (Production)
- 로그인하지 않은 HTTP 요청으로 공개 사이트, JS 파일, SPA 경로가 HTTP 200을 반환함을 확인했습니다.
- 자동 재배포: GitHub Vercel 앱과 `kodahye1/GPT` 저장소 연결을 완료했습니다. Production Branch는 `main`입니다. 이 브랜치의 변경 사항은 같은 공개 URL로 자동 배포됩니다.

## 이후 코드 수정하기

이미 복제한 이 프로젝트 폴더에서 코드를 수정하고 실행합니다.

```powershell
npm test
npm run build
git add .
git commit -m "Update AI Model Manager"
git push origin main
```

GitHub 인증 창이 열리면 본인 계정으로 로그인합니다. GitHub 웹에서 파일을 수정하고 `main`에 커밋해도 자동 배포됩니다. 진행 상태는 https://vercel.com/dahye14/ai-model-manager/deployments 에서 확인합니다. Vercel CLI를 매번 실행할 필요는 없습니다.

2026-10-19 갱신: 현재 로컬 앱의 최신 모델 목록, 상세 내용, 모델별 이미지와 인터랙션을 배포 소스에 그대로 반영했습니다. 원본 소스·에셋·라이선스·테스트 48개 파일의 SHA-256이 배포 사본과 일치합니다. 기존 테스트 8개, TypeScript 검사와 Vite 프로덕션 빌드가 모두 통과했습니다. 앱 내 브라우저의 초기 탐색 오류로 이번 버전의 최종 화면 대조는 수행하지 못했습니다. 실제 휴대폰과 다른 PC에서의 접속 확인은 아래 절차를 사용하면 됩니다.

## 1. GitHub 없이 바로 배포

Node.js 24가 설치된 PowerShell에서 실행합니다.

```powershell
git clone https://github.com/kodahye1/GPT.git ai-model-manager
cd ai-model-manager
npm ci
npm test
npm run build
npx vercel@latest login
npx vercel@latest --prod
```

로그인 명령이 표시하는 브라우저 인증을 완료합니다. 처음 배포할 때는 자신의 계정/팀을 선택하고, 새 프로젝트를 만들며, 프로젝트 폴더는 현재 폴더 `./`를 선택합니다. Vite 설정은 `vercel.json`에 들어 있습니다. 기존 프로젝트 연결은 재배포하려는 프로젝트가 있을 때만 선택합니다.

배포가 `Ready`로 완료되면 Vercel이 실제 URL을 출력합니다. 프로젝트 Dashboard의 Domains에서 Production 도메인을 확인하고 그 HTTPS 주소를 공유합니다. 프로젝트명에 따른 주소는 배포가 끝나기 전까지 확정되지 않습니다.

이후 이 폴더의 코드를 수정하고 `npx vercel@latest --prod`를 실행하면 같은 프로젝트를 재배포합니다. `.vercel/`은 로컬 연결 정보이므로 GitHub에 올리지 않습니다.

## 2. GitHub 연결로 자동 재배포

1. GitHub에서 새 저장소를 만듭니다. 소스 공개가 필요 없으면 Private으로 만듭니다. 새 저장소는 README와 초기 파일 없이 비워 두면 아래 명령을 바로 사용할 수 있습니다.
2. **이 배포용 폴더를** 저장소 루트로 사용합니다. 상위 Codex 폴더 전체를 올리지 않습니다.
3. 아래 명령에서 `YOUR_ACCOUNT`와 `YOUR_REPOSITORY`를 실제 값으로 바꿔 실행합니다.

```powershell
git init -b main
git add .
git commit -m "Prepare AI Model Manager for Vercel"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Git이 작성자 이름/이메일을 요청하면 본인의 정보를 설정한 뒤 커밋합니다. GitHub 인증 창이 열리면 로그인합니다. 기존 저장소에 파일이 있으면 해당 저장소를 먼저 복제하고 이 폴더의 소스를 옮겨 커밋하는 방식으로 진행합니다.

4. Vercel의 [새 프로젝트](https://vercel.com/new)에서 GitHub를 연결하고 해당 저장소를 Import합니다. CLI로 이미 프로젝트를 배포했다면 그 프로젝트의 Settings → Git에서 같은 저장소를 연결하여 하나의 프로젝트를 계속 사용합니다.
5. 새로 Import하는 경우 아래 설정을 확인하고 Deploy를 누릅니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `./` (이 폴더를 저장소 루트로 올린 경우) |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | `24.x` |
| Environment Variables | 없음 |
| Production Branch | `main` |

이후 `main`에 push하면 Production이 자동으로 갱신되고 다른 브랜치/PR에는 Preview가 생성됩니다. 자동 배포는 GitHub 연결이 실제로 완료된 뒤 동작합니다.

## 3. 휴대폰·다른 컴퓨터에서 확인

1. Vercel에서 표시된 **Production 도메인**을 복사합니다. `127.0.0.1`이나 로컬 미리보기 주소는 외부 공유용이 아닙니다.
2. 휴대폰의 Wi-Fi를 끄고 모바일 데이터로 접속합니다.
3. 다른 컴퓨터의 비공개 창에서도 같은 주소를 엽니다. Vercel 로그인 없이 화면이 나타나는지 확인합니다.
4. 모델 선택, 대상 IP 선택, Install 진행률/완료, 새로고침 후 상태 유지, 검색과 IP 추가를 확인합니다.
5. 로그인 화면이 나타나면 프로젝트의 Settings → Deployment Protection에서 Production 도메인의 공개 접근 설정을 확인합니다. Preview URL과 Production 도메인의 접근 범위는 다를 수 있습니다.

PC를 종료해도 Vercel에 배포한 사이트에는 접속할 수 있습니다. 단, 현재 앱은 브라우저별 Local Storage를 사용하는 데모여서 기기 간 설치 상태를 공유하지 않습니다. IP와 설치 작업도 시뮬레이션입니다.

원본 UI에는 `min-width: 760px`가 있습니다. 디자인을 보존했으므로 작은 휴대폰 화면에서는 가로 스크롤이 필요할 수 있습니다. 모바일 전용 레이아웃 변경은 이번 배포 설정에 포함하지 않았습니다.

## 공식 문서

- [Vite on Vercel 및 SPA 설정](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel CLI 로그인](https://vercel.com/docs/cli/login)
- [Vercel CLI 배포](https://vercel.com/docs/cli/deploy)
- [GitHub 자동 배포](https://vercel.com/docs/git/vercel-for-github)
- [Node.js 버전 설정](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Deployment Protection](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments)
