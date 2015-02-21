#!/bin/bash

ROOT_PATH=`pwd`
npm install

echo '>> business'
cd business
npm install

echo '>> miscellaneous'
cd ${ROOT_PATH}/miscellaneous/project-mom-and-pop/
npm install

echo '>> FF'
cd ${ROOT_PATH}/FF/
npm install
