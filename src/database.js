import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url);

// # eh o private do JS,pra variavel n seja alterada fora da fujncao
export class Database {
  #database = {}

  //Read the file if exist,or create if dont
  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    console.log('this is the persist')
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  //If search exist, return data filtered, if not, return everything
  select(table, search) {
    // check if exist ,if not,return empty array
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      //See database exist, da push nele
      this.#database[table].push(data)
    } else {
      // se n,todo database vai ser essa nova data


      this.#database[table] = [data]
    }

    //Salva no "banco" = file
    this.#persist()

    return data
  }

  update(table, id, data) {

    // diferente de -1 eh pq achou
    const findIndex = this.#database[table].findIndex(row => row.id === id)
    const { title: newTitle, description: newDescription } = data;

    //console.log(this.#database[table][findIndex])
    if (findIndex > -1) {
      let { completed_at, created_at, title, description } = this.#database[table][findIndex]

      title = newTitle ?? title
      description = newDescription ?? description

      this.#database[table][findIndex] = { id, created_at, completed_at, updated_at: new Date(), title, description }
      console.log(this.#database[table][findIndex])
      this.#persist()
      return "Task Updated successfully"
    } else {
      return "ID Not Found"
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    //bigger than -1 means that it found the id
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist()
      return "Task Deleted successfully"
    } else {
      return "ID Not Found"

    }
  }

  completeTask(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      //Found the task,update the task

      //Check if completed or not
      if (this.#database[table][rowIndex].completed_at) {
        this.#database[table][rowIndex].completed_at = null
        this.#database[table][rowIndex].updated_at = new Date()

      } else {
        this.#database[table][rowIndex].completed_at = new Date()
        this.#database[table][rowIndex].updated_at = new Date()
      }

      console.log(this.#database[table][rowIndex]);
      return "Task Completed successfully"
    } else {
      return "ID Not Found"

    }
  }
}