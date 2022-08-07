#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
nodeScriptPath="${__rootDir}/scripts/ts"
envPath="${__rootDir}/env"

source ${__dirname}/utils/ReadEnv.sh
source ${__dirname}/utils/Log.sh

git checkout .
git pull

cd ${__rootDir}/scripts
fontPath="${__rootDir}/packages/client/src/assets/font"
if [ ! -d $fontPath ]; then
    Warning "begin generate font..."
    $(pnpm tsx ${nodeScriptPath}/fontmin/index.ts)
    echo ""
    Success "font generate end"
fi

if [ -f ${envPath}/.env ]; then
    staticPath=$(ReadEnv ${envPath}/.env PUBLIC_STATIC_PATH)

    if [ ! -d "${staticPath}/headPic" ]; then
        Error "缺少静态文件夹 headPic"
        exit
    fi
    if [ ! -d "${staticPath}/emojis/noah" ]; then
        Error "缺少静态文件夹 emojis/noah"
        exit
    fi
else
    Error "请设置环境变量文件 ${envPath}/.env"
    exit
fi

cd $__rootDir
pm2 delete blog
pnpm build:server
pnpm build:client
pm2 start ${__rootDir}/pm2.json

Success "blog is running"
