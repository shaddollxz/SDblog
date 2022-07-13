#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)

source ${__dirname}/utils/Array.sh

msgMaxLength=90
allows=('feat:' 'fix:' 'test:' 'chore:' 'pref:' 'style:' 'docs:' 'refactor:' 'revert:' 'Merge')
desc=("添加新功能" "修复bug" "修改测试用例" "配置改变" "代码优化" "代码格式修改" "修改文档" "代码重构" "代码回滚" "合并代码")

msg=$(echo $(cat ${__rootDir}/$1) | tr -d '\r')
head=${msg%%[[:space:]]*}
body=${msg#*[[:space:]]}

if [ -z $body ]; then
    tput setaf 1
    echo "请输入提交内容"
    exit 1
fi

if ((${#body} > $msgMaxLength)); then
    tput setaf 1
    echo "提交内容过长，请限制在${msgMaxLength}个字符内"
    exit 1
fi

if [ $(IndexOf $head ${allows[@]}) == -1 ]; then
    tput setaf 1
    echo "提交信息出错，请按照下面的格式重新编写提交信息："
    tput setaf 7
    for ((i = 0; i < ${#allows[@]}; i++)); do
        printf "%-10s %s\n" ${allows[i]} ${desc[i]}
    done
    exit 1
fi
