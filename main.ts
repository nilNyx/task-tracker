import { readFileSync, writeFileSync, existsSync } from "fs";
import { formatDate, formatTime  } from "./formatting.ts";

const FILE = 'tasks.json';

type taskStatuses = 'todo' | 'in-progress' | 'done';

interface Task {
  id: number;
  description: string;
  status: taskStatuses;
  createdAt: string;
  updatedAt: string;
}

function nowFormatted(): string {
  const date = new Date();

  return `${formatDate(
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    ' ',
    true,
    true
  )
  } ${formatTime(date.getHours(), date.getMinutes())}`
}

function loadTasks(): Task[] {
  if (!existsSync(FILE)) return [];
  const data: string = readFileSync(FILE, 'utf-8');
  if (!data) return [];
  return JSON.parse(data);
}

function saveTasks(tasks: Task[]): void {
  writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function generateTask(description: string, tasks: Task[]): Task {
  const id: number = nextTaskId(tasks);

  const timestamp = nowFormatted();

  return {
    id: id,
    description: description,
    status: 'todo',
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function nextTaskId(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map(task => task.id)) + 1;
}

function addCommand(argument: string): void {
  const tasks: Task[] = loadTasks();

  const task = generateTask(argument, tasks);
  tasks.push(task);

  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${task.id})`)
}

function updateCommand(id: number, description: string): void {
  if (Number.isNaN(id) || !description) {
    console.error("Usage: update <id> <name>");
    return;
  }

  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    console.error(`Task with id ${id} not found`);
    return;
  }

  task.description = description;
  task.updatedAt = nowFormatted();
  saveTasks(tasks);

  console.log("updated");
}

function deleteCommand(id: number): void {
  if (isNaN(id)) {
    console.error("Usage: delete <id>");
    return;
  }

  const tasks = loadTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    console.error(`Task with id ${id} not found`);
    return;
  }

  tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`Task ${id} deleted`);
}

function listCommand(argument: taskStatuses): void {
  const tasks: Task[] = loadTasks();

  if (argument === 'todo' || argument === 'in-progress' || argument === 'done') {
    const filteredTasks = tasks.filter((task) => task.status === argument)
    if (!filteredTasks.length) {
      console.log('No tasks found.');
      return;
    }

    for (let task of filteredTasks) {
      console.log(task);
    }

  } else {
    console.log(tasks)
  }
}

function mark(id: number, mark: 'done' | 'in-progress'): void {
  if (Number.isNaN(id)) {
    console.error("Usage: mark-in-progress <id> | mark-done <id>");
    return;
  }

  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    console.error(`Task with id ${id} not found`);
    return;
  }

  task.status = mark;
  task.updatedAt = nowFormatted();
  saveTasks(tasks);

  console.log('marked');
}

function printUsage(): void {
  console.error(
    `Usage:
  add              <name>      | -a   <name>,
  update           <id> <name> | -u   <id> <name>,
  delete           <id>        | -d   <id>,
  list             <status>    | -l   <status>,
  mark-in-progress <id>        | -mip <id>,
  mark-done        <id>        | -md  <id>
`
  );
}

function init(): void {
  const args: string[] = process.argv.slice(2);
  const command: string | undefined = args[0];
  const argument: string | undefined = args[1];

  const tasks: Task[] = loadTasks();

    // `add` command
  if (command === 'add' || command === '-a') {
    if (!argument) {
      console.log(`Usage: add <name>`)
      return;
    }
    addCommand(argument);
    // `update` command
  } else if (command === 'update' || command === '-u') {
    const idArg = Number(argument);
    const descArg = args[2];

    if (!descArg) {
      console.log('Description argument is empty.')
      return;
    }
    updateCommand(idArg, descArg);

    // `delete` command
  } else if (command === 'delete' || command === '-d') {
    const idArg = Number(argument);

    deleteCommand(idArg)
    // `list` command
  } else if (command === 'list' || command === '-l') {

    const status: unknown = args[1];

    if (status === 'todo' || status === 'in-progress' || status === 'done') {
      listCommand(status)
    } else console.log(tasks);

  } else if (command === 'mark-in-progress' || command === '-mip') {

    mark(Number(argument), 'in-progress');

  } else if (command === 'mark-done' || command === '-md') {
    mark(Number(argument), 'done');

    // printing if command is not found
  } else {
    printUsage();
  }
}

export { init };