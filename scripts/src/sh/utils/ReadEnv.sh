#!/bin/bash

# 读取.env文件
# 第一个参数是文件地址 第二个是读取的键
function ReadEnv() {
    envpath=$1
    key=$2

    if [ -f $envpath ]; then
        value=$(cat $envpath | grep "$key=")
        # 读取的文件如果是\r\n结尾会有问题 删除它
        echo $(echo ${value#*=} | tr -d '\r')
    fi
}
