package router

import (
	"github.com/gin-gonic/gin"
	"github.com/gitobhub/zhihu/controllers"
	"github.com/gitobhub/zhihu/middleware"
)

func Route(router *gin.Engine) {
	router.LoadHTMLGlob("views/**/*")
	//	router.LoadHTMLFiles("views/index.html")

	router.Static("/static", "./static")

	//foobar
	router.GET("/foo", handleFoo)

	router.NoRoute(controllers.Handle404)
	router.GET("/", controllers.IndexGet)
	router.GET("/signup", controllers.SignupGet)
	router.POST("/signup", controllers.SignupPost)
	router.GET("/signin", controllers.SigninGet)
	router.POST("/signin", controllers.SigninPost)
	router.GET("/logout", controllers.LogoutGet)
	//question
	router.GET("/question/:qid", controllers.QuestionGet)
	//answer
	router.GET("/question/:qid/answer/:aid", middleware.RefreshSession(), controllers.AnswerGet)
	//
	router.GET("/topic/autocomplete", controllers.SearchTopics)
	//api
	api := router.Group("/api")
	{
		api.GET("/answers/:id/voters", controllers.AnswerVoters)
		//		api.GET("answers/:id/comments", controllers.AnswerComments)
		api.GET("questions/:id/comments", controllers.QuestionComments)
		api.GET("questions/:id/followers", controllers.QuestionFollowers)
		api.GET("/members/:url_token", controllers.MemberInfo)

		api.Use(middleware.SigninRequired())
		api.POST("/questions", controllers.PostQuestion)
		//api.DELETE("/questions/:id", controllers.DeleteQuestion)

		api.POST("/answers/:id/voters", controllers.VoteAnswer)

		//		api.POST("/answers/:id/comments", controllers.PostAnswerComment)
		//		api.DELETE("/answers/:id/comments", controllers.DeleteAnswerComment)

		api.POST("/questions/:id/answers", controllers.PostAnswer)
		api.DELETE("/answers/:id", controllers.DeleteAnswer)
		api.POST("/answers/:id/actions/restore", controllers.RestoreAnswer)

		api.POST("/questions/:id/comments", controllers.PostQuestionComment)
		api.DELETE("/questions/:id/comments/:cid", controllers.DeleteQuestionComment) //qid not avaliable

		api.POST("/questions/:id/followers", controllers.FollowQuestion)
		api.DELETE("/questions/:id/followers", controllers.UnfollowQuestion) //204NoContent

		api.POST("/questions/:id/comments/:cid/actions/like", controllers.LikeQuestionComment)
		api.DELETE("/questions/:id/comments/:cid/actions/like", controllers.UndoLikeQuestionComment)

		api.POST("/members/:url_token/followers", controllers.FollowMember)
		api.DELETE("/members/:url_token/followers", controllers.UnfollowMember)

		api.POST("/topics", controllers.PostTopic)
	}
}

func handleFoo(c *gin.Context) {
	c.HTML(200, "foo.html", nil)
}
