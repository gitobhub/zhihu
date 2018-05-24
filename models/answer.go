package models

import (
	"log"
	"strconv"
)

func InsertAnswer(qid, content string, uid uint) (string, error) {
	var err error
	defer func() {
		if err != nil {
			log.Println("models.InsertAnswer(): ", err)
		}
	}()

	tx, err := db.Begin()
	if err != nil {
		return "", err
	}
	defer tx.Rollback()

	res, err := tx.Exec("INSERT answers SET content=?, user_id=?, question_id=?", content, uid, qid)
	if err != nil {
		return "", err
	}
	aid, err := res.LastInsertId()
	if err != nil {
		return "", err
	}
	_, err = tx.Exec("UPDATE questions SET answer_count=answer_count+1 WHERE id=?", qid)
	if err != nil {
		return "", err
	}
	_, err = tx.Exec("UPDATE users SET answer_count=answer_count+1 WHERE id=?", uid)
	if err != nil {
		return "", err
	}
	err = tx.Commit()
	if err != nil {
		return "", err
	}
	return strconv.FormatInt(aid, 10), err
}

func DeleteAnswer(aid string, uid uint) error {
	var err error
	defer func() {
		if err != nil {
			log.Println("models.InsertAnswer(): ", err)
		}
	}()

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var qid string
	err = tx.QueryRow("SELECT question_id FROM answers WHERE id=?", aid).Scan(&qid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE answers SET is_deleted=1 WHERE id=?", aid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE questions SET answer_count=answer_count-1 WHERE id=?", qid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE users SET answer_count=answer_count-1 WHERE id=?", uid)
	if err != nil {
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return err
}

func RestoreAnswer(aid string, uid uint) error {
	var err error
	defer func() {
		if err != nil {
			log.Println("models.RestoreAnswer(): ", err)
		}
	}()

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var qid string
	err = tx.QueryRow("SELECT question_id FROM answers WHERE id=?", aid).Scan(&qid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE answers SET is_deleted=0 WHERE id=?", aid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE questions SET answer_count=answer_count+1 WHERE id=?", qid)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE users SET answer_count=answer_count+1 WHERE id=?", uid)
	if err != nil {
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return err
}
