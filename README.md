# sqld-monorepo

## 프로젝트 실행

### 준비물

1. [node.js](https://nodejs.org/)

```sh
brew install node # 맥
sudo apt install nodejs # 우분투
winget install OpenJS.NodeJS # 윈도우
```

2. [uv](https://docs.astral.sh/uv)

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh # 리눅스, 맥
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex" # 윈도우
```

### 프로젝트 가져오기

```sh
git clone https://github.com/sesac-namu/proj-sqld
gh repo clone sesac-namu/proj-sqld # 깃허브 CLI
```

```sh
cd proj-sqld
```

### 환경 설정

```sh
corepack enable
corepack use pnpm@10.11.0 # pnpm 준비
pnpm install # 패키지 설치
```

### 개발 서버 구동

```sh
pnpm run dev
```

### 프로젝트 빌드

```sh
pnpm run build
```

## 스크립트

```sh
pnpm run {script}
```

| 이름 | 동작 |
| ---- | ---------- |
| `dev` | 개발 서버 구동 |
| `build` | 프로젝트 빌드 |
| `format` | 프로젝트별 포매팅 |
| `lint` | 프로젝트별 린팅 |
