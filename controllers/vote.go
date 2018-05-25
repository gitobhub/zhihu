package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/models"
)

type VoteType struct {
	Type string
}

func VoteAnswer(c *gin.Context) {
	var succeed bool
	aid := c.Param("id")
	if aid == "" {
		c.JSON(http.StatusOK, gin.H{
			"succeed": succeed,
		})
		return
	}

	user, _ := Visitor(c)
	if user == nil {
		c.JSON(http.StatusForbidden, gin.H{
			"success": succeed,
		})
		return
	}

	var voteType VoteType
	decoder := json.NewDecoder(c.Request.Body)
	if err := decoder.Decode(&voteType); err != nil {
		log.Println(err)
		c.JSON(http.StatusOK, gin.H{
			"success": succeed,
		})
		return
	}

	switch voteType.Type {
	case "up":
		succeed = user.UpVote(aid)
	case "down":
		succeed = user.DownVote(aid)
	case "neutral":
		succeed = user.Neutral(aid)
	default:
	}
	c.JSON(http.StatusOK, gin.H{
		"success": succeed,
	})
}

func AnswerVoters(c *gin.Context) {
	aid := c.Param("id")
	if aid == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	uid := VisitorID(c)
	page := &models.Page{
		Session: sessions.Default(c),
	}
	offset, _ := strconv.Atoi(c.Request.FormValue("offset"))
	voters := page.AnswerVoters(aid, offset, uid)

	c.JSON(http.StatusOK, gin.H{
		"paging": page.Paging,
		"data":   voters,
	})
}
