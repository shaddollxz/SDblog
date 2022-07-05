#!/bin/bash

__dirname=$(pwd)

source ${__dirname}/scripts/utils/Array.sh
source ${__dirname}/scripts/utils/ReadEnv.sh

# 按规律进行转换
function NormalTrans() {
    filename=$1

    vowels=(a e i o u)
    addES=(s x sh ch)
    addVES=(f fe)

    lastOne=${filename:0-1}
    lastTwo=${filename:0-2}

    if [ $(IndexOf $lastOne ${addES[@]}) != -1 -o $(IndexOf $lastTwo ${addES[@]}) != -1 ]; then
        echo "${filename}es"
    elif [ $(IndexOf $lastOne ${addVES[@]}) != -1 ]; then
        echo "${filename:0:0-1}ves"
    elif [ $(IndexOf $lastTwo ${addVES[@]}) != -1 ]; then
        echo "${filename:0:0-2}ves"
    elif [ ${filename:0-1} == "y" -a $(IndexOf ${filename:0-2:0-1} ${vowels[@]}) == -1 ]; then
        echo "${filename:0:0-1}ies"
    else
        echo "${filename}s"
    fi

}

# 特别的转换
function SpecialTrans() {
    filename=$1
    special=(goose geese foot feet tooth teech man men woman women mouse
        mice sheep sheep deer deer fish fish child children ox oxen potato potatoes tomato tomatoes)

    indexof=$(IndexOf $filename ${special[@]})
    if [ $indexof != "-1" ]; then
        echo ${special[$(($indexof + 1))]}
        return 0
    fi
    echo "0"
    return 0
}

function Plural() {
    files=$(ls ${__dirname}/packages/server/src/db)
    expect=(dbBase connect verifycode index)

    for filepath in $files; do
        filename=${filepath##*/}
        filename=${filename%%.*}
        if [ $(IndexOf $filename ${expect[@]}) != "-1" ]; then
            continue
        fi

        if [ $(SpecialTrans $filename) != "0" ]; then
            echo $(SpecialTrans $filename)
        else
            echo $(NormalTrans $filename)
        fi
        ((index++))
    done
}

function main() {
    outDir=$1
    dbname=$(ReadEnv DBNAME)
    if [ -z $dbname ]; then
        echo "缺少环境变量"
        exit
    fi
    for tablename in $(Plural); do
        $(mongoexport -d $dbname -c $tablename -o ${outDir}/${tablename}.json)
    done
}

outDir=$1
if [ -z $outDir ]; then
    echo "请输入导出路径"
    read outDir
fi

echo $(main $outDir)
