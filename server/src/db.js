import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data.db')

const db = await (async () => {
  const SQL = await initSqlJs()
  let buffer
  try {
    buffer = fs.readFileSync(dbPath)
  } catch {
    buffer = null
  }
  const instance = new SQL.Database(buffer)

  instance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  instance.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('piano', 'guitar', 'slider')),
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  return instance
})()

function save() {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

export function getOne(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  let result = null
  if (stmt.step()) {
    result = stmt.getAsObject()
  }
  stmt.free()
  return result
}

export function getAll(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const results = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

export function insert(sql, params = []) {
  db.run(sql, params)
  save()
  const stmt = db.prepare('SELECT last_insert_rowid() as id')
  stmt.step()
  const { id } = stmt.getAsObject()
  stmt.free()
  return id
}

export function execute(sql, params = []) {
  db.run(sql, params)
  save()
}

export default db
