package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/models"
)

type DataState struct {
	Page     string           `json:"page"`
	Answers  []*models.Answer `json:"answers"`
	Question *models.Question `json:"question"`
	TopStory []*models.Action `json:"topStory"`
}

func AnswerGet(c *gin.Context) {
	user, uid := Visitor(c)
	//	qid, _ := strconv.ParseUint(c.Param("qid"), 10, 0) //question ID
	aid := c.Param("aid") //answer ID
	answer := models.GetAnswer(aid, uid)
	if answer == nil {
		c.HTML(http.StatusNotFound, "404.html", nil)
		return
	}
	//	if answer.Deleted {
	//		c.Redirect(http.StatusSeeOther, "/question/" + answer.Question.ID)
	//	}

	v := DataState{
		Page:     "answer",
		Question: answer.Question,
	}
	v.Answers = append(v.Answers, answer)
	dataState, _ := json.Marshal(&v)
	c.HTML(http.StatusOK, "answer.html", gin.H{
		"answer":    answer,
		"question":  answer.Question,
		"user":      user,
		"dataState": string(dataState),
	})
}

func QuestionGet(c *gin.Context) {
	user, uid := Visitor(c)
	qid := c.Param("qid") //question ID
	if qid == "" {
		c.HTML(http.StatusNotFound, "404.html", nil)
		log.Println("controllers.QuestionGet(): no question id")
		return
	}
	question := models.GetQuestionWithAnswers(qid, uid)
	if question == nil {
		c.HTML(http.StatusNotFound, "404.html", nil)
		return
	}

	v := DataState{
		Page:     "question",
		Question: question,
	}
	for _, answer := range question.Answers {
		v.Answers = append(v.Answers, answer)
	}
	dataState, _ := json.Marshal(&v)
	c.HTML(http.StatusOK, "question.html", gin.H{
		"question":  question,
		"user":      user,
		"dataState": string(dataState),
	})
}
