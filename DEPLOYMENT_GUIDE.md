# GitHub Pages 배포 가이드

## 🚀 현재 상황
- ✅ GitHub 저장소 생성됨: https://github.com/jeonck/stock-moving-average
- ✅ 소스 코드 푸시 완료
- ❌ GitHub Actions 배포 실패 (3회 시도)
- ❌ GitHub Pages 설정 필요

## 📋 배포 절차

### 1. GitHub Actions 워크플로우 파일 확인

현재 위치: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout 🛎️
      uses: actions/checkout@v4
      
    - name: Setup Node.js 📦
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: react-app/package-lock.json
        
    - name: Install dependencies 📥
      working-directory: ./react-app
      run: npm ci
      
    - name: Build 🔧
      working-directory: ./react-app
      run: npm run build
      
    - name: Deploy 🚀
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./react-app/dist
```

### 2. GitHub 저장소에서 수동 설정

#### A. GitHub Pages 활성화
1. GitHub 저장소 이동: https://github.com/jeonck/stock-moving-average
2. **Settings** 탭 클릭
3. 왼쪽 사이드바에서 **Pages** 클릭
4. **Source** 섹션에서 **GitHub Actions** 선택 (Deploy from a branch가 아님!)
5. **Save** 버튼 클릭

#### B. Repository Permissions 확인
1. **Settings** → **Actions** → **General**
2. **Workflow permissions** 섹션 확인
3. **Read and write permissions** 선택
4. **Allow GitHub Actions to create and approve pull requests** 체크
5. **Save** 버튼 클릭

### 3. 대안 방법: 간단한 워크플로우 사용

기존 워크플로우가 계속 실패하면 다음과 같이 간단한 워크플로우로 교체:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: react-app/package-lock.json
    
    - name: Install dependencies
      working-directory: ./react-app
      run: npm ci
    
    - name: Build
      working-directory: ./react-app
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./react-app/dist
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 4. 수동 배포 방법 (GitHub Actions 사용 안 함)

만약 GitHub Actions가 계속 문제가 되면 수동으로 배포 가능:

```bash
# 로컬에서 빌드
cd react-app
npm install
npm run build

# gh-pages 패키지 사용 (이미 설치됨)
npm run deploy
```

### 5. 현재 발생한 문제들과 해결책

#### 문제 1: npm 의존성 오류
- **원인**: package-lock.json 이슈, date-fns 모듈 참조 오류
- **해결**: ✅ 완료 - vite.config.js에서 date-fns 제거

#### 문제 2: GitHub Actions 권한 이슈
- **원인**: GITHUB_TOKEN 권한 부족
- **해결**: Repository Settings에서 Actions 권한 설정

#### 문제 3: 워크플로우 파일 위치
- **원인**: 처음에 react-app/.github에 있었음
- **해결**: ✅ 완료 - 루트 .github/workflows/로 이동

### 6. 배포 확인 방법

1. **GitHub Actions 탭**에서 워크플로우 실행 상태 확인
2. **Settings → Pages**에서 배포 URL 확인
3. 배포 URL: https://jeonck.github.io/stock-moving-average/

### 7. 트러블슈팅 체크리스트

- [ ] GitHub Pages가 "GitHub Actions" 소스로 설정되어 있는가?
- [ ] Repository에 Actions read/write 권한이 있는가?
- [ ] 워크플로우 파일이 `.github/workflows/deploy.yml`에 있는가?
- [ ] `react-app/package.json`의 homepage 필드가 올바른가?
- [ ] `vite.config.js`의 base 경로가 올바른가?
- [ ] 로컬에서 `npm run build`가 성공하는가?

### 8. 현재 파일 구조

```
stock-moving-average/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 워크플로우
├── react-app/
│   ├── src/                    # React 소스코드
│   ├── dist/                   # 빌드 결과물 (배포할 파일들)
│   ├── package.json            # 의존성 및 스크립트
│   ├── vite.config.js         # Vite 빌드 설정
│   └── ...
├── yfiance-ma.py              # 원본 Streamlit 앱
├── README.md                  # 프로젝트 문서
└── CLAUDE.md                  # 개발 문서
```

### 9. 수동 해결 단계

1. **GitHub 웹사이트에서 직접 설정**:
   - Settings → Pages → Source를 "GitHub Actions"로 변경
   - Settings → Actions → General → Permissions 확인

2. **워크플로우 단순화**:
   - 현재 복잡한 워크플로우를 위의 간단한 버전으로 교체

3. **로컬에서 수동 배포**:
   ```bash
   cd react-app
   npm run deploy
   ```

이 가이드를 따라 진행하면 GitHub Pages 배포가 성공할 것입니다!