#!/bin/bash

__dirname=$(pwd)

source ${__dirname}/scripts/utils/Array.sh

# 按规律进行转换
function _NormalTrans() {
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
function _SpecialTrans() {
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

# 见单词转换为复数形式
function TransToPlural() {
    input=$1
    if [ $(_SpecialTrans $input) != "0" ]; then
        echo $(_SpecialTrans $input)
    else
        echo $(_NormalTrans $input)
    fi
}
