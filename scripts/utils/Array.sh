#!/bin/bash

# 指定字符在数组的哪个位置
function IndexOf() {
    args=$@
    arr=${args#*[[:space:]]}

    index=0
    for item in ${arr[@]}; do
        if [ $item == $1 ]; then
            echo $index
            return 0
        fi
        ((index++))
    done

    echo -1
    return 1
}

# 用指定符号切割字符串为数组
function Split() {
    split=$1
    string=$2

    index=0
    while [ $(expr index "$string" $split) != 0 ]; do
        start=$(expr index "$string" $split)
        result[$index]=${string:0:$(($start - 1))}
        string=${string:$start}
        ((index++))
    done
    result[$index]=$string
    echo ${result[@]}
}
