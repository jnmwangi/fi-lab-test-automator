#!/bin/bash

repolink=$1
installPath="/app/repos"
readarray -d / -t strarr <<<"$repolink" #split a string based on the delimiter ':'
arraylen=`expr ${#strarr[*]} - 1`
usernameIndex=`expr ${arraylen} - 1`
reponame=${strarr[arraylen]}
username=${strarr[usernameIndex]}
readarray -d . -t repoparts <<<"$reponame"
reponame=${repoparts[0]}
echo "Welcome to lab automation"
cd $installPath
mkdir $username && cd $username

# handle when repository already exists
if [ -d $reponame ]; then
    rm -r -f $reponame
fi
git clone $repolink
#continue after checking repo existance

# Hand any cloning failure by retrying 5 times
if [ ! -d $reponame ]; then
    tries=0
   while [ $tries -lt 5 ]
    do
        git clone $repolink
        if [ ! -d $reponame ]; then
            tries=`expr $tries + 1`
            if [ $tries -eq 5]; then
                echo "Failed to clone the repository"
                exit
            fi
        fi
    done
fi
# Stop handling the clode failures

cd $reponame
if [ ! -d "node_modules" ]; then
    npm install
fi
npm test
#cleaning up
cd ../../
rm -r -f $username
