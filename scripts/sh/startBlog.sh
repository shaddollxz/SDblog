#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
nodeScriptPath="${__rootDir}/scripts/ts"
envPath="${__rootDir}/env"

source ${__dirname}/utils/ReadEnv.sh
source ${__dirname}/utils/Log.sh

service mongod stop

git checkout .
git pull --force

# 检查字体文件
cd ${__rootDir}/scripts
fontPath="${__rootDir}/packages/client/src/assets/font"
if [ ! -d $fontPath ]; then
    Warning "begin generate font..."
    $(pnpm tsx ${nodeScriptPath}/fontmin/index.ts)
    echo ""
    Success "font generate end"
fi

# 检查静态资源
if [ -f ${envPath}/.env ]; then
    staticBasePath=$(ReadEnv ${envPath}/.env PUBLIC_STATIC_PATH)
    assetsPath=$(ReadEnv ${envPath}/.env PUBLIC_ASSETS_PATH)
    panPath=$(ReadEnv ${envPath}/.env PAN_PATH)
    tempPath=$(ReadEnv ${envPath}/.env TEMP_PATH)

    if [ -z $staticBasePath ]; then
        Error "缺少环境变量 PUBLIC_STATIC_PATH"
        exit
    fi
    if [ -z $assetsPath ]; then
        Error "缺少环境变量 PUBLIC_ASSETS_PATH"
        exit
    fi
    if [ -z $panPath ]; then
        Error "缺少环境变量 PAN_PATH"
        exit
    fi
    if [ -z $tempPath ]; then
        Error "缺少环境变量 TEMP_PATH"
        exit
    fi
    if [ ! -d $staticBasePath ]; then
        mkdir $staticBasePath
        Error "缺少静态资源文件夹 $staticBasePath 已生成该文件夹"
    fi
    if [ ! -d "${staticBasePath}${assetsPath}/headPic" ]; then
        mkdir "${staticBasePath}${assetsPath}/headPic"
        Error "缺少静态资源文件夹 ${staticBasePath}${assetsPath}/headPic 已生成该文件夹"
    fi
    if [ ! -d "${staticBasePath}${assetsPath}/emojis" ]; then
        mkdir "${staticBasePath}${assetsPath}/emojis"
        Error "缺少静态资源文件夹 ${staticBasePath}${assetsPath}/emojis 已生成该文件夹"
    fi
    if [ ! -d "${staticBasePath}${assetsPath}/emojis/noah" ]; then
        mkdir "${staticBasePath}${assetsPath}/emojis/noah"
        Error "缺少静态资源文件夹 ${staticBasePath}${assetsPath}/emojis/noah 已生成该文件夹"
    fi
    if [ ! -d "${staticBasePath}${panPath}" ]; then
        mkdir "${staticBasePath}${panPath}"
        Error "缺少静态资源文件夹 ${staticBasePath}${panPath} 已生成该文件夹"
    fi
    if [ ! -d "${staticBasePath}${tempPath}" ]; then
        mkdir "${staticBasePath}${tempPath}"
        Error "缺少静态资源文件夹 ${staticBasePath}${tempPath} 已生成该文件夹"
    fi
else
    Error "请设置环境变量文件 ${envPath}/.env"
    exit
fi

cd $__rootDir
pm2 delete blog
pnpm build
pm2 start ${__rootDir}/pm2.json
pm2 update
pm2 list

service mongod start

Success "blog is running"
