package migrations

import "embed"

// Files contains SQL migrations applied at API startup.
//
//go:embed *.sql
var Files embed.FS
