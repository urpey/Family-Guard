set -e
set -x

npm t
npm run build

scp -r package.json "ubuntu@bad-project:~/badproject"
rsync -SavLP public "ubuntu@bad-project:~/badproject"
rsync -SavLP dist "ubuntu@bad-project:~/badproject"
ssh ubuntu@bad-project "
  cd ~/badproject &&\
  git fetch &&
  git checkout $CI_COMMIT_SHA &&
  npm i --prod &&\
  cd dist &&\
  npx knex migrate:latest  --env production &&\
  forever restart ./server.js\
"