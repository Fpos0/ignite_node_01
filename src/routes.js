import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

//iinicia O DB
const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const date = new Date()
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: date,
        updated_at: date,
      }
      const tasks = database.insert('tasks', task)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      //Search BY id -> then update
      const { title, description } = req.body;
      const response = database.update('tasks', id, {
        title,
        description
      })
      if (response == "Task Updated successfully") {
        return res.writeHead(200).end(JSON.stringify(response))
      } else {
        return res.writeHead(404).end(JSON.stringify(response))

      }

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const response = database.delete('tasks', id)
      if (response == "ID Not Found") {
        return res.writeHead(404).end(JSON.stringify(response))
      } else {
        console.log(response);
        return res.writeHead(200).end(JSON.stringify(response))
      }

    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      //Search BY id -> then update
      const response = database.completeTask('tasks', id)

      if (response == "Task Updated successfully") {
        return res.writeHead(200).end(JSON.stringify(response))
      } else {
        return res.writeHead(404).end(JSON.stringify(response))

      }

    }
  }
]