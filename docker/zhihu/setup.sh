#!/bin/bash
cd $GOPATH/src/github.com/gitobhub/zhihu
echo 'Installing'
go install
echo 'Run zhihu'
zhihu
