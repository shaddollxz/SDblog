#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
serverPath=${__rootDir}/packages/server
workerPath=${serverPath}/src/workers

source ${__dirname}/utils/String.sh
source ${__dirname}/utils/Log.sh

cd $serverPath
pnpm build

workers=$(ls $workerPath)
for worker in $workers; do
    if [ $(EndWith $worker .js) == 1 ]; then
        cp ${workerPath}/$worker ${serverPath}/bin/workers
    fi
done

Success 'server build end'
