지금 나는 FBS에서 node.js 설치 및 nvm 설치  
corepack enable pnpm 까지 
완료하였다.

그리하여

pnpm -v 까지 해서 잘 나온다! 

밑에 일단 환경설정 참고 좀 하고,


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
| `db:generate` | 데이터베이스 마이그레이션 SQL 생성 |
| `db:migrate` | 데이터베이스 마이그레이션 |
| `db:push` | 데이터베이스에 스키마 적용 |
| `db:studio` | 로컬 데이터베이스 스튜디오 |


---

# 🔥 자!! 우리 다시 next.js 부터 다시 설치를 해봅시다!