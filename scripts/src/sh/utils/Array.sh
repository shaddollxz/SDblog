#!/bin/bash

# 指定字符在数组的哪个位置
# 第一个参数是查找的元素 第二个参数是数组
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
# 第一个参数是切割字符 第二个参数是数组
function Split() {
    split=$1
    string=$2

    echo $(echo $string | tr -t $split " ")
}
