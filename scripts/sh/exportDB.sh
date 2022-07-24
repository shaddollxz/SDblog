#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
envPath=${__rootDir}/env

source ${__dirname}/utils/Array.sh
source ${__dirname}/utils/ReadEnv.sh
source ${__dirname}/utils/TransToPlural.sh
source ${__dirname}/utils/Log.sh

function main() {
    outDir=$1
    dbname=$(ReadEnv $envPath/.env DBNAME)
    if [ -z $dbname ]; then
        Error "缺少环境变量 DBNAME"
        exit
    fi

    files=$(ls ${__rootDir}/packages/server/src/db)
    expect=(DB connect index verifycode tempfile)

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

    Success "文件已导出至"
    Warning $outDir
}

outDir=$1
if [ -z $outDir ]; then
    echo "请输入导出文件所在文件夹路径"
    read outDir
fi

main $outDir
