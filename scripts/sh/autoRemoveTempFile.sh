#!/bin/bash

# 这个脚本通过crontab定时运行
# 使用 crontab -e 然后添加
# 0 4 * * * cd 当前这个文件的位置 && sh 脚本名
# 会在每天凌晨4点运行一次这个脚本
# 关于crontab https://linux265.com/news/3099.html

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
envPath=${__rootDir}/env/.env

source ${__dirname}/utils/ReadEnv.sh

staticPath=$(ReadEnv $envPath PUBLIC_STATIC_PATH)
panFileDir=$(ReadEnv $envPath PAN_PATH)
keepDay=$(ReadEnv $envPath PUBLIC_TEMP_DAY)

find "${staticPath}${panFileDir}" -mtime "+${keepDay}" -name "*" -delete
