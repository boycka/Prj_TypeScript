export type DeveloperRole = "frontend" | "backend" | "fullstack" | "qa";

export interface Developer {
  id: number;
  name: string;
  role: DeveloperRole;
  experience: number;
  active: boolean;

  [key: string]: string | number | boolean;
}

export interface Team {
  id: number;
  name: string;
  project: string;
  memberIds: number[];
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface ProjectTask {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeId: number;
  storyPoints: number;
}

export type ProjectEvent =
  | { type: "task-created"; taskId: number; title: string }
  | { type: "task-completed"; taskId: number; developerId: number }
  | { type: "developer-joined"; developerId: number; teamId: number };

export type TaskCompletedEvent = Extract<
  ProjectEvent,
  { type: "task-completed" }
>;

// Conditional type: choose a result type based on a task's status.
export type TaskStatusOutput<T extends TaskStatus> =
  T extends "todo" ? string :
  T extends "in-progress" ? number :
  T extends "done" ? boolean :
  never;

// infer extracts an array element type.
export type ArrayElement<T> = T extends (infer Item)[] ? Item : never;

// Utility type examples.
export type NewDeveloper = Omit<
  Pick<Developer, "id" | "name" | "role" | "experience" | "active">,
  "id"
> & Pick<Developer, "specialty">;
export type DeveloperSummary = Pick<Developer, "id" | "name" | "role">;
export type DeveloperUpdate = Partial<Developer>;
export type ActiveTask = ProjectTask & {
  status: Extract<TaskStatus, "in-progress">;
};
export type OpenTaskStatus = Exclude<TaskStatus, "done">;
export type TeamWorkload = Record<DeveloperRole, number>;

