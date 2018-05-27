package utils

import (
	"testing"
)

var createURLTokenTests = []struct {
	name string
	want string
}{
	{"nihao", "nihao"},
	{"你好", "ni-hao"},
	{"你k好", "ni-khao"},
	{"你123好k", "ni-123hao-k"},
	{"k你k好k", "kni-khao-k"},
}

func TestCreateURLToken(t *testing.T) {
	for _, tt := range createURLTokenTests {
		urlToken := CreateURLToken(tt.name)
		if urlToken != tt.want {
			t.Errorf("name: %s, expected: %s, got %s", tt.name, tt.want, urlToken)
		}
	}
}

var validateUsernameTests = []struct {
	username    string
	shouldError bool
}{
	{"12345@163.com", false},
	{"12345", true},
	{"root", true},
}

func TestValidateUsername(t *testing.T) {
	for _, test := range validateUsernameTests {
		err := ValidateUsername(test.username)
		switch {
		case err == nil && test.shouldError:
			t.Errorf("username: %s, should have returned error", test.username)
		case err != nil && !test.shouldError:
			t.Errorf("username %s should not have returned error, got %v", test.username, err)
		}
	}
}

var validateFullnameTests = []struct {
	fullname    string
	shouldError bool
}{
	{"fdsfds", false},
	{"12345@163.com", true},
	{"root-._123你好@}|{|}", true},
	{"-_.", true},
	{"-_.dsaf", true},
	{"ds af", false},
	{"12345", false},
	{"root", false},
	{"你好", false},
	{"root-._123你好", false},
}

func TestValidateFullname(t *testing.T) {
	for _, test := range validateFullnameTests {
		err := ValidateFullname(test.fullname)
		switch {
		case err == nil && test.shouldError:
			t.Errorf("fullname: %s, should have returned error", test.fullname)
		case err != nil && !test.shouldError:
			t.Errorf("fullname %s should not have returned error, got %v", test.fullname, err)
		}
	}
}

var validatePasswordTests = []struct {
	password    string
	shouldError bool
}{
	{"12345@163.com", false},
	{"root-._123你好@}|{|}", true},
	{"-_.>?>?..../....", true},
	{"-_.dsaf2222", true},
	{"ds afdfsf 1244", true},
	{"12345", true},
}

func TestValidatePassword(t *testing.T) {
	for _, test := range validatePasswordTests {
		err := ValidatePassword(test.password)
		switch {
		case err == nil && test.shouldError:
			t.Errorf("password: %s, should have returned error", test.password)
		case err != nil && !test.shouldError:
			t.Errorf("password %s should not have returned error, got %v", test.password, err)
		}
	}
}
