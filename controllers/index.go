package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/models"
)

func IndexGet(c *gin.Context) {
	user, uid := Visitor(c)
	answers := models.TopContent(uid)
	c.HTML(http.StatusOK, "index.html", gin.H{
		"user":    user,
		"answers": answers,
	})
	return
}
