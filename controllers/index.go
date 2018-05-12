package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"zhihu/models"
)

func IndexGet(c *gin.Context) {
	user, uid := models.Visitor(c)
	answers := models.TopContent(uid)
	c.HTML(http.StatusOK, "index.html", gin.H{
		"user":    user,
		"answers": answers,
	})
	return
	//	}
	//	c.HTML(http.StatusOK, "home.html", gin.H{
	//		"user":    user,
	//		"answers": answers,
	//	})
}
