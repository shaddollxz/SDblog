#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
envPath=${__rootDir}/env

source ${__dirname}/utils/TransToPlural.sh
source ${__dirname}/utils/Array.sh
source ${__dirname}/utils/ReadEnv.sh
source ${__dirname}/utils/Log.sh

function main() {
    inputDir=$1
    if [ ! -d $inputDir ]; then
        Error "没有该路径"
        exit
    fi

    dbname=$(ReadEnv ${envPath}/.env DBNAME)
    if [ -z $dbname ]; then
        Error "缺少环境变量 DBNAME"
        exit
    fi
    username=$(ReadEnv ${envPath}/.env DBUSER)
    password=$(ReadEnv ${envPath}/.env DBPWD)

    tablefiles=$(ls ${__rootDir}/packages/server/src/db)
    expect=(DB connect index verifycode tempfile)

    index=0
    for filepath in $tablefiles; do
        filename=${filepath##*/}
        filename=${filename%%.*}
        if [ $(IndexOf $filename ${expect[@]}) != "-1" ]; then
            continue
        fi
        tables[index]=$(TransToPlural filename)
        ((index++))
    done

    pm2 delete blog

    files=$(ls $inputDir)
    for filename in $files; do
        filename=${filename%%.json}
        if [ $(IndexOf $filename ${tables[@]}) ]; then
            $(mongoimport -u $username -p $password -d $dbname -c $filename --file ${inputDir}/${filename}.json)
        fi
    done

    pm2 start ${__rootDir}/pm2.json

    Success "finish"
}

inputDir=$1
if [ -z $inputDir ]; then
    echo "请输入导入文件的文件夹"
    read inputDir
fi

main $inputDir
