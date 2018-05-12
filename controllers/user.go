package controllers

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"zhihu/config"
	"zhihu/models"
)

func SigninGet(c *gin.Context) {
	c.HTML(http.StatusOK, "signin.html", nil)
}

func SigninPost(c *gin.Context) {
	username := c.Request.FormValue("username") //c.PostForm()
	password := c.Request.FormValue("password")
	nextPath := c.PostForm("next")
	user := models.GetAuthUserinfo(username)
	if user == nil {
		c.JSON(200, gin.H{
			"succeed": false,
			"message": "该邮箱号尚未注册知乎",
		})
		return
	}
	if user.Password != password {
		c.JSON(200, gin.H{
			"succeed": false,
			"message": "帐号或密码错误",
		})
		return
	}

	sess := sessions.Default(c)
	sess.Clear()
	sess.Set(config.Server.SessionKey, user.ID)
	sess.Save()
	c.Redirect(http.StatusSeeOther, nextPath)
}

func SignupGet(c *gin.Context) {
	c.HTML(http.StatusOK, "signup.html", nil)
}

func SignupPost(c *gin.Context) {
	username := c.Request.FormValue("username")
	name := c.Request.FormValue("name")
	password := c.Request.FormValue("password")

	user := new(models.AuthUserinfo)
	user.Email = username
	user.Name = name
	user.Password = password
	if err := models.InsertAuthUser(user); err != nil {
		log.Println("singup: ", err)
		c.JSON(http.StatusOK, gin.H{
			"succeed": false,
			"message": err.Error(),
		})
	}

	c.Redirect(http.StatusSeeOther, "/signin")
}

func LogoutGet(c *gin.Context) {
	sess := sessions.Default(c)
	sess.Clear()
	sess.Save()
	nextPath := c.GetHeader("referer")
	c.Redirect(http.StatusSeeOther, nextPath)
}
