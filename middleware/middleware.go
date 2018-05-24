package middleware

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/config"
)

func SigninRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess := sessions.Default(c)
		userID := sess.Get(config.Server.SessionKey)
		if userID == nil {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "not authorized",
			})
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
