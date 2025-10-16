package models

import (
	"log"
	"time"
)

type ErrorResponse struct {
	Error     string    `json:"error"`
	Timestamp time.Time `json:"timestamp"`
	Path      string    `json:"-"`
}

func NewErrorResponse(err error, path string) *ErrorResponse {
	return &ErrorResponse{Error: err.Error(), Timestamp: time.Now(), Path: path}
}

func (this *ErrorResponse) String() string {
	return this.Path + " " + this.Error + " " + this.Timestamp.String()
}

func (this *ErrorResponse) Log() *ErrorResponse {
	log.Println(this.String())
	return this
}
