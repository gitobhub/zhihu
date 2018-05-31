package models

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"unicode"

	"github.com/gitobhub/zhihu/utils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/henrylee2cn/pholcus/common/pinyin"
)

func InsertUser(user *User) (uid uint, err error) {
	defer func() {
		if err != nil {
			log.Println("models.InsertUser: ", err)
		}
	}()
	tx, err := db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	urlToken, urlTokenCode, err := CreateURLToken(tx, user.Name)
	if err != nil {
		return 0, err
	}
	res, err := tx.Exec("INSERT users SET email=?, fullname=?, password=?, url_token=?, url_token_code=?", user.Email, user.Name, user.Password, urlToken, urlTokenCode)
	if err != nil {
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	uid = uint(id)
	err = tx.Commit()
	if err != nil {
		return 0, err
	}
	return uid, nil
}

func CreateURLToken(tx *sql.Tx, name string) (string, int, error) {
	s := []rune(name)
	var res []string
	for i := len(s) - 1; i >= 0; i-- {
		r := s[i]
		if unicode.IsDigit(r) || unicode.IsLower(r) || unicode.IsUpper(r) {
			c := fmt.Sprintf("%c", r)
			if res == nil {
				res = append(res, c)
			} else {
				res[len(res)-1] = c + res[len(res)-1]
			}
		} else {
			res = append(res, pinyin.SinglePinyin(r, pinyin.NewArgs())[0])
		}
	}
	for to, from := 0, len(res)-1; to < from; to, from = to+1, from-1 {
		res[to], res[from] = res[from], res[to]
	}
	urlToken := strings.Join(res, "-")

	urlTokenCode := 0
	if err := tx.QueryRow("SELECT url_token_code FROM users WHERE url_token=? ORDER BY id DESC limit 1",
		urlToken).Scan(&urlTokenCode); err != nil {
		if err == sql.ErrNoRows {
			return urlToken, urlTokenCode, nil
		}
		return "", 0, err
	}
	return urlToken, urlTokenCode + 1, nil
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
		log.Printf("user %s: %v", username, err)
		return nil
	}
	return user
}

func GetUserByID(uid uint) *User {
	var err error
	defer func() {
		if err != nil {
			log.Println("models.GetUserByID(): uid =", uid, err)
		}
	}()
	user := new(User)
	stmt, err := db.Prepare("SELECT id, fullname, gender, headline, url_token, " +
		"url_token_code, avatar_url, answer_count, follower_count FROM users WHERE id=?")
	if err != nil {
		return nil
	}
	defer stmt.Close()

	urlTokenCode := 0
	err = stmt.QueryRow(uid).Scan(
		&user.ID, &user.Name, &user.Gender, &user.Headline,
		&user.URLToken, &urlTokenCode, &user.AvatarURL,
		&user.AnswerCount, &user.FollowerCount)
	if err != nil {
		return nil
	}
	utils.URLToken(&user.URLToken, urlTokenCode)

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

func GetUserByURLToken(urlToken string, uid uint) *User {
	user := new(User)
	if err := db.QueryRow("SELECT id, fullname, gender, headline, avatar_url, "+
		"answer_count, follower_count FROM users WHERE url_token=? AND url_token_code=0", urlToken).Scan(
		&user.ID, &user.Name, &user.Gender,
		&user.Headline, &user.AvatarURL,
		&user.AnswerCount, &user.FollowerCount,
	); err != nil {
		if err == sql.ErrNoRows {
			s := strings.Split(urlToken, "-")
			if len(s) == 1 {
				return nil
			}
			code := s[len(s)-1]
			pre := strings.TrimSuffix(urlToken, "-"+code)
			if err := db.QueryRow("SELECT id, fullname, gender, headline, avatar_url, "+
				"answer_count, follower_count FROM users WHERE url_token=? AND url_token_code=?", pre, code).Scan(
				&user.ID, &user.Name, &user.Gender,
				&user.Headline, &user.AvatarURL,
				&user.AnswerCount, &user.FollowerCount,
			); err != nil {
				return nil
			}
		} else {
			return nil
		}
	}
	user.URLToken = urlToken
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
