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
echo "Running Tests, please wait..."

workingDir=$(pwd)
repoDir="/repos"
installPath="$workingDir$repoDir"
if [ ! -d $installPath ]; then
    mkdir $installPath
fi
cd $installPath
if [ ! -d $username ]; then
    mkdir $username
fi
cd $username

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

#inpect the package.json file to determine if it's react
isReactApp=0
while read line; do
    for word in $line; do
        if [ $word == \"react\": ]; then
            isReactApp=1
            break
        fi
    done
    if [ $isReactApp -eq 1 ]; then 
        break
    fi
done < package.json

if [ ! -d "node_modules" ]; then
    echo "Installing node packages remotely..."
    npm install --production=false
fi


echo "Running tests..."
if [ $isReactApp -eq 1 ]; then 
    # npm install jest-junit
    # npx react-scripts test --coverage --ci --testResultsProcessor="jest-junit" --watchAll=false
    # npm test -- --watchAll=false --no-color 2> tests.txt    
    npx react-scripts test --watchAll=false --no-color 2> tests
    cat tests
else
    npm test
fi

#cleaning up
cd $installPath
rm -r -f $username
