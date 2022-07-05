#!/bin/bash

function ReadEnv() {
    envpath=$1
    key=$2

    if [ -f $envpath ]; then
        value=$(cat $envpath | grep "$key=")
        echo ${value#*=}
    fi
}
