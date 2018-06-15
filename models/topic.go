package models

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"unicode/utf8"

	"github.com/garyburd/redigo/redis"
)

func SearchTopics(token string) []Topic {
	topics := []Topic{}
	conn := redisPool.Get()
	defer conn.Close()
	//
	words := strings.Split(token, " ")
	var keys []interface{}
	for _, t := range words {
		keys = append(keys, "ind:"+t)
	}
	//
	keys = append(keys, "ind:"+token)
	//
	for i, v := range token {
		if utf8.RuneLen(v) == 1 {
			continue
		}
		if i == len([]rune(token))-1 && v == []rune(" ")[0] {
			break
		}
		keys = append(keys, fmt.Sprintf("ind:%c", v))
	}
	//
	res, err := redis.Int64s(conn.Do("SUNION", keys...))
	if err != nil {
		log.Println("models.SearchTopics(): ", err)
		return nil
	}
	for _, id := range res {
		var name string
		if err := db.QueryRow("SELECT name FROM topics WHERE id=?", id).Scan(&name); err != nil {
			log.Println("modles.SearchTopics(): ", err)
			continue
		}
		topics = append(topics, Topic{
			Name: name,
			ID:   uint(id),
		})
	}
	return topics
}

func UpdateTopic(topic *Topic) error {
	var id int64
	var err error
	defer func() {
		if err != nil {
			log.Println("models.InsertTopic(): ", err)
		}
	}()

	tx, err := db.Begin()
	if err != nil {
		return nil
	}
	defer tx.Rollback()

	if err = tx.QueryRow("SELECT id FROM topics WHERE name=?", topic.Name).Scan(&id); err == nil {
		if err = tx.Commit(); err != nil {
			return err
		}
		topic.ID = uint(id)
		return nil
	}
	if err != sql.ErrNoRows {
		return err
	}
	row, err := tx.Exec("INSERT topics SET name=?", topic.Name)
	if err != nil {
		return err
	}
	id, err = row.LastInsertId()

	if err = tx.Commit(); err != nil {
		return err
	}
	//
	topic.ID = uint(id)
	if err = createTopicIndex(topic); err != nil {
		return err
	}
	return nil
}

func createTopicIndex(topic *Topic) error {
	conn := redisPool.Get()
	defer conn.Close()
	words := strings.Split(topic.Name, " ")
	for _, word := range words {
		key := fmt.Sprintf("ind:%s", word)
		_, err := conn.Do("SADD", key, topic.ID)
		if err != nil {
			log.Println("models.createTopicIndex() :", err)
			return err //XXX:
		}
	}
	letters := []rune(topic.Name)
	for i := 0; i < len(letters); i++ {
		key1 := fmt.Sprintf("ind:%s", string(letters[:i+1]))
		_, err := conn.Do("SADD", key1, topic.ID)
		if err != nil {
			log.Println("models.createTopicIndex() :", err)
			return err
		}
		//
		if utf8.RuneLen(letters[i]) == 1 {
			continue
		}
		if i == len(letters)-1 && letters[i] == []rune(" ")[0] {
			break
		}
		key2 := fmt.Sprintf("ind:%c", letters[i])
		_, err = conn.Do("SADD", key2, topic.ID)
		if err != nil {
			log.Println("models.createTopicIndex() :", err)
			return err
		}
	}
	//}
	return nil
}
