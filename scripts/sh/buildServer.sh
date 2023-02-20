#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
serverPath=${__rootDir}/packages/server
workerPath=${serverPath}/src/workers
mailsPath=${serverPath}/src/utils/sendMail/mails

source ${__dirname}/utils/String.sh
source ${__dirname}/utils/Log.sh

env=$1

cd $serverPath
$(set MODE=$1 && tsc)

workers=$(ls $workerPath)
workersTargetPath=${serverPath}/dist/workers
for worker in $workers; do
    if [ $(EndWith $worker .js) == 1 ]; then
        cp ${workerPath}/$worker $workersTargetPath
    fi
done

mails=$(ls $mailsPath)
mailsTargetPath=${serverPath}/dist/utils/sendMail/mails
if [ ! -d $mailsTargetPath ]; then
    mkdir $mailsTargetPath
fi
for mail in $mails; do
    cp ${mailsPath}/$mail $mailsTargetPath
done

Success 'server build end'
