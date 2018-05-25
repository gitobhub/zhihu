# zhihu
仿知乎网站

## 截图
![file](screenshots/question.png)
![file](screenshots/comment.png)

## 项目结构
```
-zhihu
    |-conf        配置文件
    |-controllers 控制器
    |-models      数据库访问
    |-middleware  中间件
    |-static      静态资源
    |-router      路由转发
    |-vendor      项目依赖
    |-views       模板文件
    |-main.go     程序执行入口
```

## 安装
本项目使用govendor管理依赖包
```
go get -u github.com/kardianos/govendor
```

```
go get -u github.com/gitobhub/zhihu
cd $GOPATH/src/github.com/gitobhub/zhihu
govendor sync
go run main.go
```

