#!/bin/bash

# Read command arguments and extract repolink, reponame and username
repolink=$1
readarray -d / -t strarr <<<"$repolink"
arraylen=`expr ${#strarr[*]} - 1`
usernameIndex=`expr ${arraylen} - 1`
reponame=${strarr[arraylen]}
username=${strarr[usernameIndex]}
readarray -d . -t repoparts <<<"$reponame"
reponame=${repoparts[0]}
echo "Welcome to lab automation"

installPath="repos"
if [ ! -d $installPath ]; then
    mkdir $installPath
fi
cd $installPath
mkdir $username && cd $username

# handle when repository already exists
if [ -d $reponame ]; then
    rm -r -f $reponame
fi
git clone $repolink
#continue after checking repo existance

# Handle any cloning failure by retrying 5 times
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
# Stop handling the clone failures

cd $reponame
if [ ! -d "node_modules" ]; then
    npm install && npm test
else
    npm test
fi
#cleaning up
# cd installPath
# rm -r -f $username
