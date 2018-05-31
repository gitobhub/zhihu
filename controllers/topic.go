package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/models"
)

func SearchTopics(c *gin.Context) {
	topics := []models.Topic{}
	token := c.Request.FormValue("token")
	if token == "" {
		c.JSON(http.StatusOK, topics)
		return
	}
	topics = models.SearchTopics(token)
	c.JSON(http.StatusOK, topics)
}

func PostTopic(c *gin.Context) {
	topic := &models.Topic{}
	decoder := json.NewDecoder(c.Request.Body)
	if err := decoder.Decode(topic); err != nil {
		log.Println("controllers.PostTopic(): ", err)
		c.JSON(http.StatusInternalServerError, nil)
		return
	}
	if err := models.UpdateTopic(topic); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"topic":   topic,
	})
}
