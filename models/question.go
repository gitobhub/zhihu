package models

import (
	"fmt"
	"log"
	//"time"

	"github.com/gitobhub/zhihu/utils"
)

func FollowQuestion(qid, uid uint) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("INSERT question_followers SET question_id=?, user_id=?",
		qid, uid); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE questions SET follower_count=follower_count+1 WHERE id=?",
		qid); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func UnfollowQuestion(qid, uid uint) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("DELETE FROM question_followers WHERE question_id=? AND user_id=?",
		qid, uid); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE questions SET follower_count=follower_count-1 WHERE id=?",
		qid); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func (page *Page) QuestionFollowers(qid string, offset int, uid uint) []Follower {
	println("QestionFollowers()")
	start := page.Session.Get("question_followers_start" + qid)
	if start == nil {
		var newStart string
		if err := db.QueryRow("SELECT question_followers.created_at FROM users, question_followers WHERE users.id=question_followers.user_id "+
			"AND question_id=? ORDER BY question_followers.created_at DESC LIMIT 1", qid).Scan(&newStart); err != nil {
			log.Println("*Page.QestionFollowers(): ", err)
			return nil
		}
		page.Session.Set("question_followers_start"+qid, newStart)
		page.Session.Save()
		start = newStart
		offset = 0
		page.Paging.IsStart = true
	}
	limit := fmt.Sprintf("limit %d,%d", offset, 10)
	rows, err := db.Query("SELECT users.id, users.name, users.gender, users.headline, "+
		"users.avatar_url, users.url_token, users.answer_count, users.follower_count FROM users, question_followers "+
		"WHERE users.id=question_followers.user_id AND question_id=? AND question_followers.created_at<=? ORDER BY question_followers.created_at DESC "+limit,
		qid, start.(string))
	println(limit)
	log.Println(start.(string))
	if err != nil {
		log.Println("*Page.QestionFollowers(): ", err)
		return nil
	}
	defer rows.Close()

	var followers []Follower
	var i int
	for ; rows.Next(); i++ {
		var follower Follower
		if err := rows.Scan(&follower.ID, &follower.Name, &follower.Gender,
			&follower.Headline, &follower.AvatarURL, &follower.URLToken,
			&follower.AnswerCount, &follower.FollowerCount); err != nil {
			log.Println("*Page.QestionFollowers(): ", err)
			continue
		}
		follower.QueryRelationWithVisitor(uid)
		followers = append(followers, follower)
	}
	if i < 10 {
		page.Paging.IsEnd = true
	} else {
		page.Paging.Next = fmt.Sprintf("/api/questions/%s/followers?offset=%d", qid, offset+i)
	}
	return followers
}

func (page *Page) QuestionComments(qid string, offset int, uid uint) []Comment {
	start := page.Session.Get("question_comments_start" + qid)
	if start == nil {
		var newStart string
		if err := db.QueryRow("SELECT created_at FROM question_comments WHERE "+
			"question_id=? ORDER BY created_at DESC LIMIT 1", qid).Scan(&newStart); err != nil {
			log.Println("*Page.QestionComments(): ", err)
			return nil
		}
		page.Session.Set("question_comments_start"+qid, newStart)
		page.Session.Save()
		start = newStart
		offset = 0
		page.Paging.IsStart = true
	}
	limit := fmt.Sprintf("limit %d,%d", offset, 10) //XXX:10
	rows, err := db.Query("SELECT users.id, users.name, users.gender, users.headline, "+
		"users.avatar_url, users.url_token, users.answer_count, users.follower_count, "+
		"question_comments.id, question_comments.content, unix_timestamp(question_comments.created_at) FROM users, question_comments "+
		"WHERE users.id=question_comments.user_id AND question_id=? AND question_comments.created_at<=? ORDER BY question_comments.created_at DESC "+limit,
		qid, start.(string))
	if err != nil {
		log.Println("*Page.QuestionComments(): ", err)
		return nil
	}
	defer rows.Close()

	conn := redisPool.Get()
	var comments []Comment
	var i int
	for ; rows.Next(); i++ {
		var dateCreated int64
		var comment Comment
		var author BasicUserinfo
		if err := rows.Scan(&author.ID, &author.Name, &author.Gender,
			&author.Headline, &author.AvatarURL, &author.URLToken,
			&author.AnswerCount, &author.FollowerCount,
			&comment.ID, &comment.Content, &dateCreated); err != nil {
			log.Println("*Page.QestionComments(): ", err)
			continue
		}
		key := fmt.Sprintf("question_comment liked:%d", comment.ID)
		v, err := conn.Do("SCARD", key)
		if err != nil {
			log.Println("*Page.QestionComments(): ", err)
			continue
		}
		comment.LikeCount = uint(v.(int64))
		v, err = conn.Do("SISMEMBER", key, uid)
		if err != nil {
			log.Println("*Page.QestionComments(): ", err)
			continue
		}
		if v.(int64) == 1 {
			comment.Liked = true
		}

		comment.DateCreated = utils.FormatBeforeUnixTime(dateCreated)
		comment.Author = &author
		//		comment.QueryRelationWithVisitor(uid)
		comments = append(comments, comment)
	}
	if i < 10 {
		page.Paging.IsEnd = true
	} else {
		page.Paging.Next = fmt.Sprintf("/api/questions/%s/comments?offset=%d", qid, offset+i)
	}
	return comments
}

func InsertQuestionComment(qid, content string, uid uint) (*Comment, error) {
	conn := redisPool.Get()
	comment := new(Comment)
	var author BasicUserinfo
	var dateCreated int64
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("INSERT question_comments SET question_id=?, user_id=?, content=?", qid, uid, content); err != nil {
		return nil, err
	}
	if _, err := tx.Exec("UPDATE questions SET comment_count=comment_count+1 WHERE id=?", qid); err != nil {
		return nil, err
	}
	if err := tx.QueryRow("SELECT users.id, users.name, users.gender, users.headline, "+
		"users.avatar_url, users.url_token, users.answer_count, users.follower_count, "+
		"question_comments.id, question_comments.content, unix_timestamp(question_comments.created_at) FROM users, question_comments "+
		"WHERE users.id=question_comments.user_id AND question_comments.id=LAST_INSERT_ID() AND question_comments.user_id=?", uid).Scan(
		&author.ID, &author.Name, &author.Gender, &author.Headline, &author.AvatarURL,
		&author.URLToken, &author.AnswerCount, &author.FollowerCount,
		&comment.ID, &comment.Content, &dateCreated); err != nil {
		log.Println("*Page.QestionComments(): ", err)
		return nil, err
	}
	key := fmt.Sprintf("question_comment liked:%d", comment.ID)
	v, err := conn.Do("SCARD", key)
	if err != nil {
		log.Println("*Page.QestionComments(): ", err)
		return nil, err
	}
	comment.LikeCount = uint(v.(int64))
	comment.DateCreated = utils.FormatBeforeUnixTime(dateCreated)
	comment.Author = &author

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return comment, nil
}

func DeleteQuestionComment(qid, cid string, uid uint) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("DELETE FROM question_comments WHERE id=? AND user_id=?", cid, uid); err != nil { //deleted by oneself
		return err
	}
	if _, err := tx.Exec("UPDATE questions SET comment_count=comment_count-1 WHERE id=?", qid); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	conn := redisPool.Get()
	conn.Do("DEL", "question_comment liked:"+cid)
	return nil
}

func LikeQuestionComment(cid string, uid uint) error {
	conn := redisPool.Get()
	v, err := conn.Do("SADD", "question_comment liked:"+cid, uid)
	if err != nil {
		return err
	}
	if v.(int64) == 0 {
		return fmt.Errorf("reply is zero")
	}
	return nil
}

func UndoLikeQuestionComment(cid string, uid uint) error {
	conn := redisPool.Get()
	v, err := conn.Do("SREM", "question_comment liked:"+cid, uid)
	if err != nil {
		return err
	}
	if v.(int64) == 0 {
		return fmt.Errorf("reply is zero")
	}
	return nil
}
