#!/bin/bash

__dirname=$(dirname -- "$0")
__rootDir=$(pwd)
clientPath=${__rootDir}/packages/client
envPath=${__rootDir}/env/.env

source ${__dirname}/utils/ReadEnv.sh
source ${__dirname}/utils/Log.sh

cd $clientPath
pnpm build:dev

cd ${__rootDir}/scripts
distPath=$(ReadEnv $envPath PUBLIC_DIST_PATH)
pnpm tsx ./ts/analyzeClientBuild/index.ts $distPath

echo ""
Success 'client build end'
