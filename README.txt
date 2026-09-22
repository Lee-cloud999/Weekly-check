WEEKLY CHECK PWA

GitHub 저장소에 아래 파일들을 모두 같은 최상위 폴더에 업로드하세요.
- index.html
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png

GitHub Pages: Settings > Pages > Deploy from a branch > main / (root)

Firebase:
- 기존 maeum-jogak2 프로젝트의 이메일/비밀번호 Authentication 사용
- Firestore 경로: users/{uid}/weekly_check/{weekStart}
- 백업 경로: users/{uid}/weekly_check_backups/{backupId}
- 기존 Firestore 규칙(users/{userId}/{document=**})과 호환됩니다.
