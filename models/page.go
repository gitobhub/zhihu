package models

import (
	"database/sql"
	"log"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gitobhub/zhihu/utils"
	_ "github.com/go-sql-driver/mysql"
)

type Page struct {
	//	*User
	Paging
	sessions.Session
}

type Paging struct {
	IsEnd bool `json:is_end`
	//	Totals   uint
	//	Previous string
	IsStart bool `json:is_start`
	Next    string
}

func TopContent(uid uint) []*Answer {
	var answers []*Answer
	//	answers = append(answers, Answer(1, uid))
	return answers
}

func AnswerPage(aid string, uid uint) *Answer {
	answer := NewAnswer()
	var dateCreated, dateModified int64
	err := db.QueryRow("SELECT id, question_id, user_id, content, unix_timestamp(created_at), unix_timestamp(modified_at), "+
		"marked_count, comment_count, is_deleted FROM answers WHERE id=?", aid).Scan(
		&answer.ID, &answer.Question.ID, &answer.Author.ID,
		&answer.Content, &dateCreated, &dateModified,
		&answer.MarkedCount, &answer.CommentCount, &answer.Deleted,
	)
	println(answer.Deleted)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Println("models.AnswerPage(): answer", aid, err)
		}
		return nil
	}
	answer.DateCreated = utils.FormatUnixTime(dateCreated)
	answer.DateModified = utils.FormatUnixTime(dateModified)
	answer.Question = GetQuestionInfo(answer.Question.ID, uid)
	answer.GetAuthorInfo(uid)
	//determine whether user voted this answer
	answer.QueryRelation(uid)

	return answer
}

/*
func (page *Page) GetAnswerComments(aid uint) (comments []*AnswerComment) {
	rows, err := db.Query("SELECT * FROM answer_comments WHERE answer_id=?", aid)
	if err != nil {
		log.Printf("answer_comments %d: %v", aid, err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		comment := new(AnswerComment)
		comment.User = new(User)
		comment.Answer = NewAnswer()
		if err := rows.Scan(
			&comment.Comment.ID, &comment.User.ID,
			&comment.Answer.ID, &comment.Comment.DateCreated,
			&comment.Comment.Content); err != nil {
			log.Printf("answer_comments %d: %v", aid, err)
			return
		}
		comments = append(comments, comment)
	}
	return
}*/

func QuestionPage(qid string, uid uint) *Question {
	question := GetQuestionInfo(qid, uid)
	question.GetAnswers(uid)

	return question
}

func GetQuestionInfo(qid string, uid uint) (question *Question) {
	question = NewQuestion()
	stmt, err := db.Prepare("SELECT id, user_id, title, description, created_at, modified_at, " +
		"answer_count, follower_count, comment_count FROM questions WHERE id=?")
	if err != nil {
		log.Println(err)
		return
	}
	defer stmt.Close()

	if err := stmt.QueryRow(qid).Scan(
		&question.ID, &question.User.ID, &question.Title,
		&question.Description, &question.DateCreated, &question.DateModified,
		&question.AnswerCount, &question.FollowerCount, &question.CommentCount,
	); err != nil {
		log.Printf("models.GetQuestionInfo %s: %v", qid, err)
		return
	}
	question.GetTopics()
	//	question.GetDataFromRedis()

	var temp int
	//query whether question's followed
	question.Followed = true
	if err := db.QueryRow("SELECT 1 FROM question_followers WHERE question_id=? AND user_id=?", qid, uid).Scan(&temp); err != nil {
		if err != sql.ErrNoRows {
			log.Println(err)
		}
		question.Followed = false
	}
	//query whether question's answered
	var deleted int
	question.Answered = true
	if err := db.QueryRow("SELECT id, is_deleted FROM answers WHERE question_id=? AND user_id=?", qid, uid).Scan(&question.VisitorAnswerID, &deleted); err != nil {
		if err != sql.ErrNoRows {
			log.Println(err)
		}
		question.Answered = false
	}
	println(deleted)
	if deleted == 1 {
		question.VisitorAnswerDeleted = true
	}
	println(question.VisitorAnswerDeleted)
	//question visit count + 1
	question.UpdateVisitCount()

	return
}

/*func GetQuestionComments(qid uint) (comments []*QuestionComment) {
	rows, err := db.Query("SELECT * FROM question_comments WHERE question_id=?", qid)
	if err != nil {
		log.Printf("question_comments %d: %v", qid, err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		comment := new(QuestionComment)
		comment.Comment.User = new(User)
		comment.Question = NewQuestion()
		if err := rows.Scan(&comment.Comment.ID, &comment.Comment.User.ID, &comment.Question.ID, &comment.Comment.DateCreated, &comment.Comment.Content); err != nil {
			log.Printf("question_comments %d: %v", qid, err)
			return
		}
		comments = append(comments, comment)
	}
	return
}*/

func (q *Question) GetTopics() {
	rows, err := db.Query("SELECT topic_id, topic_name FROM question_topics WHERE question_id=?", q.ID)
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()

	var topics []*Topic
	for rows.Next() {
		topic := new(Topic)
		if err := rows.Scan(&topic.ID, &topic.Name); err != nil {
			log.Println("*Question.GetTopics(): ", err)
			continue
		}
		topics = append(topics, topic)
	}
	q.Topics = topics
}

func (q *Question) GetAnswers(uid uint) {
	rows, err := db.Query("SELECT id, question_id, user_id, content, UNIX_TIMESTAMP(created_at),"+
		" UNIX_TIMESTAMP(modified_at), marked_count, comment_count FROM answers WHERE question_id=? AND is_deleted=0", q.ID)
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()

	var answers []*Answer
	var dateCreated, dateModified int64
	for rows.Next() {
		answer := NewAnswer()
		if err := rows.Scan(
			&answer.ID, &answer.Question.ID, &answer.Author.ID,
			&answer.Content, &dateCreated, &dateModified,
			&answer.MarkedCount, &answer.CommentCount,
		); err != nil {
			log.Printf("answer %d: %v", answer.ID, err)
		}
		answer.DateCreated = utils.FormatUnixTime(dateCreated)
		answer.DateModified = utils.FormatUnixTime(dateModified)
		answer.GetAuthorInfo(uid)
		answer.QueryRelation(uid)

		answers = append(answers, answer)
	}
	q.Answers = answers
}

func (answer *Answer) QueryRelation(uid uint) {
	conn := redisPool.Get()
	v, err := conn.Do("SCARD", "upvoted:"+answer.ID)
	if err != nil {
		log.Println(err)
	}
	answer.UpvoteCount = uint(v.(int64))

	if uid == 0 {
		return
	}
	userID := strconv.FormatUint(uint64(uid), 10)
	{
		v, err := conn.Do("SISMEMBER", "upvoted:"+answer.ID, userID)
		if err != nil {
			log.Println(err)
		}
		if v.(int64) == 1 {
			answer.Upvoted = true
			println("answer.Upvoted = true")
		}
	}
	if answer.Upvoted != true {
		v, err := conn.Do("SISMEMBER", "downvoted:"+answer.ID, userID)
		if err != nil {
			log.Println(err)
		}
		if v.(int64) == 1 {
			answer.Downvoted = true
			println("answer.Downvoted = true")
		}
	}
	//
	if uid == answer.Author.ID {
		answer.Answered = true
	}
}

func (question *Question) UpdateVisitCount() {
	println("UpdateVisitCount()")
	conn := redisPool.Get()
	v, err := conn.Do("INCR", "visited:"+question.ID)
	if err != nil {
		log.Println("*Question.UpdateVisitCount(): ", question.ID, err)
	}
	question.VisitCount = uint(v.(int64))
}
