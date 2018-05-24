package models

import (
	"database/sql"
	"errors"
	_ "github.com/go-sql-driver/mysql"
	"log"
	//	"github.com/henrylee2cn/pholcus/common/pinyin"
)

func InsertAuthUser(user *AuthUserinfo) error {
	dup := isUsernameExist(user.Email)
	if dup {
		return errors.New("Already exists")
	}
	//TODO:
	urlToken := user.Name

	stmt, err := db.Prepare("INSERT users SET email=?, name=?, password=?, url=?")
	if err != nil {
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(user.Email, user.Name, user.Password, urlToken)
	return err
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

func GetAuthUserinfo(username string) *AuthUserinfo {
	stmt, err := db.Prepare("SELECT id, email, password FROM users WHERE email=?")
	if err != nil {
		log.Println(err)
		return nil
	}
	defer stmt.Close()

	user := new(AuthUserinfo)
	if err := stmt.QueryRow(username).Scan(&user.ID, &user.Email, &user.Password); err != nil {
		log.Printf("user %d: %v", username, err)
		return nil
	}
	return user
}

func GetBasicUserinfo(uid uint) *BasicUserinfo {
	user := new(BasicUserinfo)
	stmt, err := db.Prepare("SELECT id, name, gender, headline, url_token, " +
		"avatar_url, answer_count, follower_count FROM users WHERE id=?")
	if err != nil {
		log.Println("models.GetBasicUserinfo(): ", err)
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
	author := new(Author)
	author.BasicUserinfo = *GetBasicUserinfo(answer.Author.ID)
	author.BasicUserinfo.QueryRelationWithVisitor(uid)
	answer.Author = author
}

func (user *BasicUserinfo) QueryRelationWithVisitor(uid uint) error {
	var temp int
	if err := db.QueryRow("SELECT 1 FROM member_followers WHERE member_id=? AND follower_id=?",
		user.ID, uid).Scan(&temp); err != nil {
		if err == sql.ErrNoRows {
			println(uid, "user.Followed = false")
			return nil
		}
		println("user.Followed = false", err.Error())
		return err
	}
	user.Followed = true
	println("user.Followed = true")
	return nil
}

func GetMemberByURLToken(urlToken string, uid uint) *BasicUserinfo {
	user := new(BasicUserinfo)
	if err := db.QueryRow("SELECT id, name, gender, headline, url_token, "+
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
