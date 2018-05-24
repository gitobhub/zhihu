package utils

import (
	"fmt"
	"time"
)

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
