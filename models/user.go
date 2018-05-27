package models

import (
	"database/sql"
	"errors"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func InsertUser(user *User) (uint, error) {
	dup := isUsernameExist(user.Email)
	if dup {
		return 0, errors.New("Already exists")
	}

	stmt, err := db.Prepare("INSERT users SET email=?, fullname=?, password=?, url_token=?")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()
	res, err := stmt.Exec(user.Email, user.Name, user.Password, user.URLToken)
	if err != nil {
		return 0, err
	}
	uid, err := res.LastInsertId()
	return uint(uid), err
}

func isUsernameExist(username string) bool {
	var id uint
	err := db.QueryRow("SELECT id FROM users WHERE email=?", username).Scan(&id)
	switch err {
	case sql.ErrNoRows:
		return false
	case nil:
		return true
	default:
		log.Printf("user %q: %v", username, err)
	}
	return true //FIXME:
}

func GetUserByUsername(username string) *User {
	stmt, err := db.Prepare("SELECT id, email, password FROM users WHERE email=?")
	if err != nil {
		log.Println(err)
		return nil
	}
	defer stmt.Close()

	user := new(User)
	if err := stmt.QueryRow(username).Scan(&user.ID, &user.Email, &user.Password); err != nil {
		log.Printf("user %d: %v", username, err)
		return nil
	}
	return user
}

func GetUserByID(uid uint) *User {
	user := new(User)
	stmt, err := db.Prepare("SELECT id, fullname, gender, headline, url_token, " +
		"avatar_url, answer_count, follower_count FROM users WHERE id=?")
	if err != nil {
		log.Println("models.GetUser(): ", err)
		return nil
	}
	defer stmt.Close()

	if err := stmt.QueryRow(uid).Scan(
		&user.ID, &user.Name, &user.Gender,
		&user.Headline, &user.URLToken, &user.AvatarURL,
		&user.AnswerCount, &user.FollowerCount,
	); err != nil {
		log.Printf("user %d: %v", uid, err)
		return nil
	}

	return user
}

func (answer *Answer) GetAuthorInfo(uid uint) {
	author := GetUserByID(answer.Author.ID)
	author.QueryRelationWithVisitor(uid)
	answer.Author = author
}

func (user *User) QueryRelationWithVisitor(uid uint) error {
	var temp int
	if err := db.QueryRow("SELECT 1 FROM member_followers WHERE member_id=? AND follower_id=?",
		user.ID, uid).Scan(&temp); err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		return err
	}
	user.Followed = true
	return nil
}

func GetMemberByURLToken(urlToken string, uid uint) *User {
	user := new(User)
	if err := db.QueryRow("SELECT id, fullname, gender, headline, url_token, "+
		"avatar_url, answer_count, follower_count FROM users WHERE url_token=?", urlToken).Scan(
		&user.ID, &user.Name, &user.Gender,
		&user.Headline, &user.URLToken, &user.AvatarURL,
		&user.AnswerCount, &user.FollowerCount,
	); err != nil {
		log.Printf("user %d: %v", uid, err)
		return nil
	}
	user.QueryRelationWithVisitor(uid)

	return user
}

func FollowMember(urlToken string, uid uint) error { //urlToken:followed, uid:to follow
	var memberID uint
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := tx.QueryRow("SELECT id FROM users WHERE url_token=?", urlToken).Scan(&memberID); err != nil {
		return err
	}
	if _, err := tx.Exec("INSERT member_followers SET member_id=?, follower_id=?", memberID, uid); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE users SET follower_count=follower_count+1 WHERE id=?", memberID); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func UnfollowMember(urlToken string, uid uint) error {
	var memberID uint
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := tx.QueryRow("SELECT id FROM users WHERE url_token=?", urlToken).Scan(&memberID); err != nil {
		return err
	}
	if _, err := tx.Exec("DELETE FROM member_followers WHERE member_id=? AND follower_id=?", memberID, uid); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE users SET follower_count=follower_count-1 WHERE id=?", memberID); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}
