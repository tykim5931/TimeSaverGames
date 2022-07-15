# How to run

> 1. 서버에 원격 저장소 만들기
> 2. pull 해 오기.
> 3. app.js 실행하기 (nodejs, express 깔려 있어야 함.)
> 4. 본인 443 포트로 접속하도록 로컬의 time saver와 서버의 game성공 시 넘어가는 url 변경해 주기. (ex> http://xxx.xxx.xx.xxx:443/junglegame) => xxx 부분 자기서버로 바꾸면 됨.

## 원격 저장소 만드는 법 (서버)
```
git init
```
```
git remote add origin <repository http url>
```
```
git remote set-url origin <repository ssh url>
```
```
git pull origin main
```
```
git checkout main (이건 git status 쳐서 자기 branch 가 main이 아닌 경우만)
```

### 퍼블리시 방법
ssh-key를 생성해서 나한테 알려줘야 함.
