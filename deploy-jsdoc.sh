#!/bin/bash

CURRENT_DIR=$(pwd)
echo "Current path: ${CURRENT_DIR}"

echo -e "Publishing JSDoc...\n"

cd $HOME
mkdir docs && cd "$_"
git config --global user.email "travis@travis-ci.org"
git config --global user.name "travis-ci"
echo -e "Cloning the gh-pages branch...\n"

git clone "https://$GH_TOKEN@github.com/proteus-h2020/proteic.git" --branch=gh-pages gh-pages
cd gh-pages
cp -Rf $CURRENT_DIR/docs .
git add -A .
git commit -m "[DOCS-$TRAVIS_BUILD_NUMBER] Generate JSDoc site (#$TRAVIS_COMMIT)."
git push -q origin gh-pages

echo -e "Published JSDoc to gh-pages.\n"
