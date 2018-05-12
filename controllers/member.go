package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"zhihu/models"
)

func MemberInfo(c *gin.Context) {
	_, uid := models.Visitor(c)
	urlToken := c.Param("url_token")
	//include := c.Request.FormValue("include")
	if urlToken == "" { //|| include == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	member := models.GetMemberByURLToken(urlToken, uid)
	if member == nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	//	s := strings.Split(incldue,",")

	/*	t := reflect.TypeOf(member).Elem()
		v := reflect.ValueOf(member).Elem()
		for i = 0; i < t.NumField(); i++ {
			_, ok := info[t.Field(i).Tag.Get("json")]
			if !ok {
				continue
			}
			name := t.Field(i).Name
			v.FieldByName(name)
		}*/

	c.JSON(http.StatusOK, member)
}

func FollowMember(c *gin.Context) {
	urlToken := c.Param("url_token")
	if urlToken == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	_, uid := models.Visitor(c)
	succeed := true
	if err := models.FollowMember(urlToken, uid); err != nil {
		succeed = false
		log.Println("controllers.FollowMember(): ", err)
	}
	c.JSON(http.StatusOK, gin.H{
		"succeed": succeed,
	})
}

func UnfollowMember(c *gin.Context) {
	urlToken := c.Param("url_token")
	if urlToken == "" {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	_, uid := models.Visitor(c)
	succeed := true
	if err := models.UnfollowMember(urlToken, uid); err != nil {
		succeed = false
		log.Println("controllers.UnfollowMember(): ", err)
	}
	c.JSON(http.StatusOK, gin.H{
		"succeed": succeed,
	})
}
