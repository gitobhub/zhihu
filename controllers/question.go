package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"zhihu/models"
)

func FollowQuestion(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}
	qid, err := strconv.ParseUint(id, 10, 0)
	if err != nil {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.FollowQuestion(): ", id, err)
		return
	}

	_, uid := models.Visitor(c)
	if err := models.FollowQuestion(uint(qid), uid); err != nil {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.FollowQuestion(): ", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"succeed": true,
	})
}

func UnfollowQuestion(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}
	qid, err := strconv.ParseUint(id, 10, 0)
	if err != nil {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.UnfollowQuestion(): ", id, err)
		return
	}

	_, uid := models.Visitor(c)
	if err := models.UnfollowQuestion(uint(qid), uid); err != nil {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.UnfollowQuestion(): ", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"succeed": true,
	})
}

func QuestionFollowers(c *gin.Context) {
	qid := c.Param("id")
	if qid == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	_, uid := models.Visitor(c)
	page := &models.Page{
		Session: sessions.Default(c),
	}
	offset, _ := strconv.Atoi(c.Request.FormValue("offset"))
	voters := page.QuestionFollowers(qid, offset, uid)

	c.JSON(http.StatusOK, gin.H{
		"paging": page.Paging,
		"data":   voters,
	})
}
