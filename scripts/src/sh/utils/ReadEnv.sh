#!/bin/bash

function ReadEnv() {
    envpath=$1
    key=$2

    if [ -f $envpath ]; then
        value=$(cat $envpath | grep "$key=")
        # 读取的文件如果是\r\n结尾会有问题 删除它
        echo $(echo ${value#*=} | tr -d '\r')
    fi
}
