package controllers

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/config"
	"github.com/gitobhub/zhihu/models"
	"github.com/gitobhub/zhihu/utils"
)

func SigninGet(c *gin.Context) {
	uid := VisitorID(c)
	if uid != 0 {
		c.Redirect(http.StatusSeeOther, "/")
		return
	}
	c.HTML(http.StatusOK, "signin.html", nil)
}

func SigninPost(c *gin.Context) {
	username := c.Request.FormValue("username") //c.PostForm()
	password := c.Request.FormValue("password")
	//	nextPath := c.PostForm("next")
	if err := utils.ValidateUsername(username); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Message,
			"code":    err.Code,
		})
		return
	}
	if len(password) < 6 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "请输入6位以上的密码",
			"code":    utils.ErrBadPasswordFormat,
		})
		return
	}

	pwdEncrypted := utils.EncryptPassword(username, password)
	user := models.GetUserByUsername(username)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "该邮箱号尚未注册知乎",
			"code":    utils.ErrAccountNotFound,
		})
		return
	}
	if user.Password != pwdEncrypted {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "帐号或密码错误",
			"code":    utils.ErrIncorrectPassword,
		})
		return
	}

	sess := sessions.Default(c)
	sess.Clear()
	sess.Set(config.Server.SessionKey, user.ID)
	sess.Save()
	c.JSON(http.StatusCreated, nil)
	//	c.Redirect(http.StatusSeeOther, nextPath)
}

func SignupGet(c *gin.Context) {
	uid := VisitorID(c)
	if uid != 0 {
		c.Redirect(http.StatusSeeOther, "/")
		return
	}
	c.HTML(http.StatusOK, "signup.html", nil)
}

func SignupPost(c *gin.Context) {
	fullname := c.Request.FormValue("fullname")
	username := c.Request.FormValue("username")
	password := c.Request.FormValue("password")
	if err := utils.ValidateFullname(fullname); err != nil {
		log.Println("fullname", err)
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Message,
			"code":    err.Code,
		})
		return
	}
	if err := utils.ValidateUsername(username); err != nil {
		log.Println("username", err)
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Message,
			"code":    err.Code,
		})
		return
	}
	if err := utils.ValidatePassword(password); err != nil {
		log.Println("password", err)
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Message,
			"code":    err.Code,
		})
		return
	}

	urlToken := utils.CreateURLToken(fullname)
	pwdEncrypted := utils.EncryptPassword(username, password)
	user := &models.User{
		Email:    username,
		Name:     fullname,
		Password: pwdEncrypted,
		URLToken: urlToken,
	}
	uid, err := models.InsertUser(user)
	if err != nil {
		log.Println("signup: ", err)
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "该邮箱已注册，请直接登录",
			"code":    utils.ErrDuplicatedEmail,
		})
		return
	}

	sess := sessions.Default(c)
	sess.Clear()
	sess.Set(config.Server.SessionKey, uid)
	sess.Save()
	c.JSON(http.StatusCreated, nil)
	//c.Redirect(http.StatusSeeOther, "/signin")
}

func LogoutGet(c *gin.Context) {
	sess := sessions.Default(c)
	sess.Clear()
	sess.Save()
	nextPath := c.GetHeader("referer")
	c.Redirect(http.StatusSeeOther, nextPath)
}
