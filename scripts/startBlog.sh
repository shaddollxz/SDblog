#!/bin/bash

__dirname=$(pwd)
nodeScriptPath="${__dirname}/packages/scripts/src"
envPath="${__dirname}/env"

source ${__dirname}/scripts/utils/ReadEnv.sh

git checkout .
git pull

fontPath="${__dirname}/packages/client/src/assets/font"
if [ ! -d $fontPath ]; then
    $(node --loader ts-node/esm ${nodeScriptPath}/fontmin/index.ts --experimental-specifier-resolution=node)
fi

if [ -f $envPath/.env ]; then
    staticPath=$(ReadEnv $envPath/.env PUBLIC_STATIC_PATH)/static

    if [ ! -d "${staticPath}/headPic" ]; then
        echo "缺少静态文件路径 headPic"
        exit
    fi
    if [ ! -d "${staticPath}/emoji/noah" ]; then
        echo "缺少静态文件路径 emoji/noah"
        exit
    fi
fi

pm2 delete blog
pnpm build:server
pnpm build:client
pm2 start ${__dirname}/pm2.json

echo "blog is running"
