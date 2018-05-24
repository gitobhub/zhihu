package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/models"
)

func PostAnswer(c *gin.Context) {
	qid := c.Param("id")
	if qid == "" {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.PostAnswer(): no question id")
		return
	}

	uid := VisitorID(c)
	content := struct {
		Content string `json:"content"`
	}{}
	decoder := json.NewDecoder(c.Request.Body)
	if err := decoder.Decode(&content); err != nil {
		log.Println("controller.PostAnswer(): ", err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	aid, err := models.InsertAnswer(qid, content.Content, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"id": aid,
	})
}

func DeleteAnswer(c *gin.Context) {
	aid := c.Param("id")
	if aid == "" {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.DeleteAnswer(): no answer id")
		return
	}

	uid := VisitorID(c)
	err := models.DeleteAnswer(aid, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}

func RestoreAnswer(c *gin.Context) {
	aid := c.Param("id")
	if aid == "" {
		c.JSON(http.StatusNotFound, nil)
		log.Println("controllers.DeleteAnswer(): no answer id")
		return
	}

	uid := VisitorID(c)
	err := models.RestoreAnswer(aid, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
