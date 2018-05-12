package middleware

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"zhihu/config"
)

func SigninRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess := sessions.Default(c)
		userID := sess.Get(config.Server.SessionKey)
		if userID == nil {
			c.Redirect(http.StatusForbidden, "/singin")
			c.Abort()
			return
		}
		c.Next()
	}
}

func RefreshSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess := sessions.Default(c)
		userID := sess.Get(config.Server.SessionKey)
		sess.Clear()
		if userID != nil {
			sess.Set(config.Server.SessionKey, userID.(uint))
		}
		sess.Save()
		c.Next()
	}
}
