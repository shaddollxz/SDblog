#!/bin/bash

__dirname=$(pwd)
envPath=$__dirname/env

source ${__dirname}/scripts/utils/Array.sh
source ${__dirname}/scripts/utils/ReadEnv.sh
source ${__dirname}/scripts/utils/TransToPlural.sh

function main() {
    outDir=$1
    dbname=$(ReadEnv $envPath/.env DBNAME)
    if [ -z $dbname ]; then
        echo "缺少环境变量 DBNAME"
        exit
    fi

    files=$(ls ${__dirname}/packages/server/src/db)
    expect=(DB connect verifycode index)

    index=0
    for filepath in $files; do
        filename=${filepath##*/}
        filename=${filename%%.*}
        if [ $(IndexOf $filename ${expect[@]}) != "-1" ]; then
            continue
        fi
        tables[index]=$(TransToPlural $filename)
        ((index++))
    done

    for tablename in ${tables[@]}; do
        $(mongoexport -d $dbname -c $tablename -o ${outDir}/${tablename}.json)
    done

    echo "finish"
}

outDir=$1
if [ -z $outDir ]; then
    echo "请输入导出文件所在文件夹路径"
    read outDir
fi

main $outDir
