# Kanban Task Manager

A Kanban board with three columns (To Do, In Progress, Completed) and full CRUD.

## What is Kanban?

Kanban started at Toyota. Instead of building parts in bulk and storing them, each step only works when the next step asks for more, using a card ("kanban"). This cuts waste, shows mistakes early, and keeps work flowing.

In software, it helps you focus: finish what you started before taking on something new.

## Features

- **Create:** click `+` in the header. Title is required (3 to 100 characters). You can set priority, due date and a description (up to 500 characters, with a counter).
- **Read:** cards show a task number, priority, Overdue / Due Soon / Done tags, due date and when the task was created.
- **Update:** use the edit icon or double-click a card. Move cards with the Start / Complete / To Do buttons or by dragging them.
- **Delete:** use the trash icon, then confirm.
- Short success messages after each change. Works on phones.

## Project structure

```
index.html
css/style.css
src/
  main.ts            App entry: starts every feature
  models/task.ts     Task types and constants
  data/
    storage.ts       Reads and writes storage
    store.ts         TaskStore: create / update / move / delete
  logic/
    taskForm.ts      Create / edit dialog
    deleteTask.ts    Delete confirmation
    cardActions.ts   Card buttons (edit, delete, move)
    dragDrop.ts      Drag & drop
  ui/
    render.ts        Draws columns and cards
    icons.ts         Icon names
  utils/
    dom.ts           DOM helpers
    date.ts          Date helpers
    toast.ts         Success messages
```

## Run

```bash
npm install
npm run build
npm start
```
