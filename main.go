package main

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"zhihu/config"
	"zhihu/router"
)

func main() {
	app := gin.Default()
	Init(app)
	app.Run(config.Server.Addr)
}

func Init(engine *gin.Engine) {
	setSession(engine)
	//Add routes
	router.Route(engine)
}

func setSession(engine *gin.Engine) {
	store := sessions.NewCookieStore([]byte(config.Server.SessionSecret))
	store.Options(sessions.Options{HttpOnly: true, MaxAge: 7 * 86400, Path: "/"}) //Also set Secure: true if using SSL, you should though
	engine.Use(sessions.Sessions("gin-session", store))
}
