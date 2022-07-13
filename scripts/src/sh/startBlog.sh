#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
nodeScriptPath="${__rootDir}/scripts/src/ts"
envPath="${__rootDir}/env"

source ${__dirname}/sh/utils/ReadEnv.sh

git checkout .
git pull

fontPath="${__rootDir}/packages/client/src/assets/font"
if [ ! -d $fontPath ]; then
    $(node --loader ts-node/esm ${nodeScriptPath}/fontmin/index.ts --experimental-specifier-resolution=node)
fi

if [ -f ${envPath}/.env ]; then
    staticPath=$(ReadEnv ${envPath}/.env PUBLIC_STATIC_PATH)

    if [ ! -d "${staticPath}/headPic" ]; then
        echo "缺少静态文件 headPic"
        exit
    fi
    if [ ! -d "${staticPath}/emojis/noah" ]; then
        echo "缺少静态文件 emojis/noah"
        exit
    fi
else
    echo "请设置环境变量文件 ${envPath}/.env"
    exit
fi

pm2 delete blog
pnpm build:server
pnpm build:client
pm2 start ${__rootDir}/pm2.json

echo "blog is running"
