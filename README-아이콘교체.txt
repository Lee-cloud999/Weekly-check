Weekly-check 아이콘 v35 · manifest 수정본

이번 수정:
- 기존 W 아이콘 디자인은 그대로 유지
- 일반 아이콘 purpose = any
- maskable 전용 아이콘 purpose = maskable 로 분리
- manifest 아이콘 URL에 ?v=35를 붙여 새 아이콘을 다시 요청하도록 함
- 서비스워커 캐시를 weekly-check-pwa-v35-icon-manifest-fix-20260926 으로 갱신

GitHub 저장소 루트에 이 ZIP의 파일을 같은 이름으로 모두 덮어쓰세요.
특히 manifest.webmanifest 와 service-worker.js 를 반드시 함께 올려주세요.

업로드 후 GitHub Pages 반영을 기다린 다음 웹페이지를 새로고침하고,
홈 화면의 기존 '주간계획' 아이콘을 삭제한 뒤 다시 설치하세요.
사이트 데이터/로컬 저장소는 삭제하지 마세요.
