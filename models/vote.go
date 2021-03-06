package models

import (
	"fmt"
	"log"

	"github.com/garyburd/redigo/redis"
)

func (user *User) UpVote(aid string) bool {
	conn := redisPool.Get()
	conn.Send("SADD", "upvoted:"+aid, user.ID)
	conn.Send("SREM", "downvoted:"+aid, user.ID)
	conn.Flush()
	upvoteAddedCount, err := conn.Receive()
	if err != nil {
		return false
	}
	if _, err := conn.Receive(); err != nil {
		return false
	}

	UpdateRank(conn, aid, 432)
	if upvoteAddedCount.(int64) == 1 {
		go func() {
			_, err := db.Exec("INSERT answer_voters SET answer_id=?, user_id=?", aid, user.ID)
			if err != nil {
				log.Println("*models.User.UpVote: ", err)
			}
			HandleNewAction(user.ID, VoteupAnswerAction, aid)
		}()
	}

	return true
}

func UpdateRank(conn redis.Conn, aid string, increment int64) error {
	_, err := conn.Do("ZINCRBY", "rank", increment, aid)
	if err != nil {
		log.Println("models.UpdateRank(): ", err)
		return err
	}
	return nil
}

func RemoveFromRank(conn redis.Conn, aid string) error {
	_, err := conn.Do("ZREM", "rank", aid)
	return err
}

func (user *User) DownVote(aid string) bool {
	conn := redisPool.Get()
	conn.Send("SADD", "downvoted:"+aid, user.ID)
	conn.Send("SREM", "upvoted:"+aid, user.ID)
	conn.Flush()
	if v, err := conn.Receive(); err != nil || v == 0 {
		log.Println(err, v.(int64))
		return false
	}
	upvoteRemovedCount, err := conn.Receive()
	if err != nil {
		return false
	}
	UpdateRank(conn, aid, -432)

	if upvoteRemovedCount.(int64) == 1 {
		go func() {
			_, err := db.Exec("DELETE FROM answer_voters WHERE answer_id=? AND user_id=?", aid, user.ID)
			if err != nil {
				log.Println("*User.DownVote: ", err)
			}
		}()
	}
	return true
}

func (user *User) Neutral(aid string) bool {
	conn := redisPool.Get()
	conn.Send("SREM", "upvoted:"+aid, user.ID)
	conn.Send("SREM", "downvoted:"+aid, user.ID)
	conn.Flush()
	upvoteRemovedCount, err := conn.Receive()
	if err != nil {
		return false
	}
	if _, err := conn.Receive(); err != nil {
		return false
	}
	UpdateRank(conn, aid, -432)

	if upvoteRemovedCount == 1 {
		go func() {
			_, err := db.Exec("DELETE FROM answer_voters WHERE answer_id=? AND user_id=?", aid, user.ID)
			if err != nil {
				log.Println("*User.DownVote: ", err)
			}
		}()
	}
	return true
}

func (page *Page) AnswerVoters(aid string, offset int, uid uint) []User {
	var voters = make([]User, 0)
	start := page.Session.Get("start" + aid)
	if start == nil {
		var newStart int
		if err := db.QueryRow("SELECT answer_voters.id FROM users, answer_voters WHERE users.id=answer_voters.user_id "+
			"AND answer_id=? ORDER BY answer_voters.id DESC LIMIT 1", aid).Scan(&newStart); err != nil {
			log.Println("*Page.AnswerVoters(): ", err)
			return voters
		}
		page.Session.Set("start"+aid, newStart)
		page.Session.Save()
		start = newStart
		offset = 0
		page.Paging.IsStart = true
	}
	limit := fmt.Sprintf("limit %d,%d", offset, 10)
	rows, err := db.Query("SELECT users.id, users.fullname, users.gender, users.headline, "+
		"users.avatar_url, users.url_token, users.answer_count, users.follower_count FROM users, answer_voters "+
		"WHERE users.id=answer_voters.user_id AND answer_id=? AND answer_voters.id<=? ORDER BY answer_voters.id DESC "+limit,
		aid, start.(int))
	if err != nil {
		log.Println("*Page.AnswerVoters(): ", err)
		return voters
	}
	defer rows.Close()

	var i int
	for ; rows.Next(); i++ {
		var voter User
		if err := rows.Scan(&voter.ID, &voter.Name, &voter.Gender,
			&voter.Headline, &voter.AvatarURL, &voter.URLToken,
			&voter.AnswerCount, &voter.FollowerCount); err != nil {
			log.Println("*Page.AnswerVoters(): ", err)
			continue
		}
		voter.QueryRelationWithVisitor(uid)
		voters = append(voters, voter)
	}
	if i < 10 {
		page.Paging.IsEnd = true
	} else {
		page.Paging.Next = fmt.Sprintf("/api/answers/%s/voters?offset=%d", aid, offset+i)
	}
	return voters
}
