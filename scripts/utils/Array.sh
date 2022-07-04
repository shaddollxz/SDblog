#!/bin/bash

# 指定字符在数组的哪个位置
function indexof() {
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
function splice() {
    old_IFS=$IFS
    IFS=$2
    array=$1
    IFS=$old_IFS
}
