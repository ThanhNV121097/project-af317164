package migrate

import "embed"

// Files contains SQL migrations embedded from the module-level migrations folder.
//
//go:embed migrations/*.sql
var Files embed.FS
