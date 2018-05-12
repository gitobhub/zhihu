package config

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

type config struct {
	Database databaseConfig
	Server   serverConfig
	Redis    redisConfig
}

type serverConfig struct {
	Addr          string
	SessionSecret string `json:"session_secret"`
	SessionKey    string `json:"session_key"`
}

type databaseConfig struct {
	DriverName string `json:"driver_name"`
	User       string
	Password   string
	Database   string
	DSN        string
}

type redisConfig struct {
	Host     string
	Port     string
	Password string
	MaxIdle  int `json:"max_idle"`
	Addr     string
}

var (
	Config   config
	Server   *serverConfig
	Database *databaseConfig
	Redis    *redisConfig
)

func initJson() {
	data, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		log.Fatal(err)
	}
	if err := json.Unmarshal(data, &Config); err != nil {
		log.Fatal(err)
	}
}
func initServer() {
	Server = &Config.Server
}

func initDatabase() {
	Database = &Config.Database
	switch Database.DriverName {
	case "mysql":
		Database.DSN = Database.User +
			":" + Database.Password +
			"@/" + Database.Database
	}
}

func initRedis() {
	Redis = &Config.Redis
	Redis.Addr = Redis.Host + ":" + Redis.Port
}

func init() {
	initJson()
	initServer()
	initDatabase()
	initRedis()
}
