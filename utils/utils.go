package utils

import (
	"crypto/md5"
	"fmt"
	"io"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/gitobhub/zhihu/config"
	"github.com/henrylee2cn/pholcus/common/pinyin"
)

type Err struct {
	Message string
	Code    int
}

func (err *Err) Error() string {
	return err.Message
}

const (
	ErrAccountNotFound = 100000 + iota
	ErrIncorrectPassword
	ErrDuplicatedEmail
	ErrBadFullnameFormat
	ErrBadEmailFormat
	ErrBadPasswordFormat
)

func ValidateFullname(fullname string) *Err {
	reg := regexp.MustCompile(`^[\p{Han}\w]+([\p{Han}\w\s.-]*)$`)
	println(fullname)
	if !reg.MatchString(fullname) {
		err := &Err{
			Message: "名字中含有特殊字符",
			Code:    ErrBadFullnameFormat,
		}
		return err
	}
	return nil
}

func ValidateUsername(username string) *Err {
	reg := regexp.MustCompile(`^[a-zA-Z0-9]+@(\w+).(\w{2,5})$`) //Email
	if !reg.MatchString(username) {
		err := &Err{
			Message: "请输入正确的邮箱",
			Code:    ErrBadEmailFormat,
		}
		return err
	}
	return nil
}

func ValidatePassword(password string) *Err {
	reg := regexp.MustCompile(`^(\w+[\w[:graph:]]*){6,}$`)
	if !reg.MatchString(password) {
		err := &Err{
			Message: "密码格式不正确",
			Code:    ErrBadPasswordFormat,
		}
		return err
	}
	return nil
}

func FormatUnixTime(dt int64) string {
	var res string
	now := time.Now()
	datetime := time.Unix(dt, 0)
	year, month, day := datetime.Date()
	nowYear, nowMonth, nowDay := now.Date()
	ydaYear, ydaMonth, ydaDay := time.Unix((now.Unix() - 86400), 0).Date() //yesterday

	if nowYear == year && nowMonth == month && nowDay == day {
		res = datetime.Format("15:04")
	} else if ydaYear == year && ydaMonth == month && ydaDay == day {
		res = "昨天 " + datetime.Format("15:04")
	} else {
		res = datetime.Format("2006-01-02")
	}
	return res
}

const (
	Minute = 60
	Hour   = 3600
	Day    = 86400
	Month  = 86400 * 30
	Year   = 86400 * 30 * 12
)

func FormatBeforeUnixTime(dt int64) string {
	var res string
	now := time.Now().Unix()
	diff := now - dt
	switch {
	case diff < Minute:
		res = "刚刚"
	case diff < Hour && diff >= Minute:
		res = fmt.Sprintf("%d分钟前", diff/Minute)
	case diff < Day && diff >= Hour:
		res = fmt.Sprintf("%d小时前", diff/Hour)
	case diff < Month && diff >= Day:
		res = fmt.Sprintf("%d天前", diff/Day)
	case diff < Year && diff >= Month:
		res = fmt.Sprintf("%d个月前", diff/Month)
	case diff >= Year:
		res = fmt.Sprintf("%d年前", diff/Year)
	}
	return res
}

func CreateURLToken(name string) string {
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
	return strings.Join(res, "-")
}

func EncryptPassword(username, password string) string {
	h := md5.New()
	io.WriteString(h, password)
	pwdMD5 := fmt.Sprintf("%x", h.Sum(nil))
	io.WriteString(h, config.Server.Salt)
	io.WriteString(h, username)
	io.WriteString(h, pwdMD5)
	return fmt.Sprintf("%x", h.Sum(nil))
}
