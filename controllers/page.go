package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"zhihu/models"
)

func AnswerGet(c *gin.Context) {
	user, uid := models.Visitor(c)
	//	qid, _ := strconv.ParseUint(c.Param("qid"), 10, 0) //question ID
	aid, _ := strconv.ParseUint(c.Param("aid"), 10, 0) //answer ID
	answer := models.AnswerPage(uint(aid), uid)
	if answer == nil {
		c.HTML(http.StatusNotFound, "404.html", nil)
		return
	}
	c.HTML(http.StatusOK, "answer.html", gin.H{
		"answer":   answer,
		"question": answer.Question,
		"user":     user,
	})
}

func QuestionGet(c *gin.Context) {
	user, uid := models.Visitor(c)
	qid, _ := strconv.ParseUint(c.Param("qid"), 10, 0) //question ID
	question := models.QuestionPage(uint(qid), uid)
	if question == nil {
		c.HTML(http.StatusNotFound, "404.html", nil)
		return
	}
	c.HTML(http.StatusOK, "question.html", gin.H{
		"question": question,
		"uest":     user,
	})
}
