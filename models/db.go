package models

import (
	"database/sql"
	"log"

	"github.com/garyburd/redigo/redis"
	"github.com/gitobhub/zhihu/config"
	_ "github.com/go-sql-driver/mysql"
)

var (
	db        *sql.DB
	redisPool *redis.Pool
)

func initDB() {
	var err error
	db, err = sql.Open("mysql", config.Database.DSN)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
}

func initRedis() {
	redisPool = redis.NewPool(func() (redis.Conn, error) {
		return redis.Dial("tcp", config.Redis.Addr)
	}, config.Redis.MaxIdle)
}

func init() {
	initDB()
	initRedis()
}
