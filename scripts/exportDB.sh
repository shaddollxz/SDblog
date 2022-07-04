#!/bin/bash

__dirname=$(pwd)
source ${__dirname}/scripts/utils/Array.sh

# 按规律进行转换
function isNormal() {
    filename=$1

    vowels=(a e i o u)
    addES=(s x sh ch)
    addVES=(f fe)

    lastOne=${filename:0-1}
    lastTwo=${filename:0-2}

    if [ $(indexof $lastOne ${addES[@]}) != -1 -o $(indexof $lastTwo ${addES[@]}) != -1 ]; then
        echo "${filename}es"
    elif [ $(indexof $lastOne ${addVES[@]}) != -1 ]; then
        echo "${filename:0:0-1}ves"
    elif [ $(indexof $lastTwo ${addVES[@]}) != -1 ]; then
        echo "${filename:0:0-2}ves"
    elif [ ${filename:0-1} == "y" -a $(indexof ${filename:0-2:0-1} ${vowels[@]}) == -1 ]; then
        echo "${filename:0:0-1}ies"
    else
        echo "${filename}s"
    fi

}

# 特别的转换
function isSpecial() {
    filename=$1
    special=(goose geese foot feet tooth teech man men woman women mouse
        mice sheep sheep deer deer fish fish child children ox oxen potato potatoes tomato tomatoes)

    indexof=$(indexof $filename ${special[@]})
    # printf "%s " $indexof$filename
    if [ $indexof != "-1" ]; then
        echo ${special[$(($indexof + 1))]}
        return 0
    fi
    echo "0"
    return 0
}

function plural() {
    files=$(ls ${__dirname}/packages/server/src/db)
    expect=(dbBase connect verifycode index)

    for filepath in $files; do
        filename=${filepath##*/}

        if [ $(indexof $filename ${expect[@]}) != "-1" ]; then
            continue
        fi

        filename=${filename%.*}
        if [ $(isSpecial $filename) != "0" ]; then
            echo $(isSpecial $filename)
        else
            echo $(isNormal $filename)
        fi
        ((index++))
    done
}

function main() {
    outDir=$1
    for dbname in $(plural); do
        $(mongoexport -d SDblog -c $dbname -o ${outDir}/${dbname}.json)
    done
}

outDir=$1
if [ -z $outDir ]; then
    echo "请输入导出路径"
    read outDir
fi

echo $(main $outDir)
