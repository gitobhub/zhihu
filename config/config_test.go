package config

import (
	"fmt"
	"testing"
)

func TestConifg(t *testing.T) {
	fmt.Printf("%#v\n", Config)
	fmt.Printf("%#v\n", Server)
	fmt.Printf("%#v\n", Database)
	fmt.Printf("%#v\n", Redis)
}
