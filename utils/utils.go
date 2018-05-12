package utils

import (
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
		res = datetime.Format("2006-Jan-2")
	}
	return res
}
