# Introduction

The notion archiver takes a snapshot of what makes up a Notion document and restores it accordingly.

`serializeRead` - Reads from database and serializes into JSON object
`deserializeWrite` - Writes to Notion database to re-populate the pages

# Snapshotting a database

Object types:

- list
- page
- block

# Writing large databases

Right now, we assume the size of the database can fit in memory.

That assumption may not hold for huge databases.

# Contributing Todos

* `deserializeWrite`
* Better typings
* `has_next` recursive fetching pages/blocks 

