import {
  type ActiveTask,
  type ArrayElement,
  type Developer,
  type DeveloperRole,
  type DeveloperSummary,
  type DeveloperUpdate,
  type OpenTaskStatus,
  type ProjectEvent,
  type ProjectTask,
  type TaskCompletedEvent,
  type TaskStatus,
  type TaskStatusOutput,
  type TeamWorkload
} from "./types";
import { DeveloperRepository, TaskRepository, TeamRepository } from "./repository";
import { Cache, Log } from "./decorators";

function isDeveloperRole(value: unknown): value is DeveloperRole {
  return value === "frontend" || value === "backend" ||
    value === "fullstack" || value === "qa";
}

// Type guard: safely narrow unknown data to a Developer.
function isDeveloper(value: unknown): value is Developer {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isDeveloperRole(candidate.role) &&
    typeof candidate.experience === "number" &&
    typeof candidate.active === "boolean";
}

class DevFlowService {
  constructor(
    private readonly developers: DeveloperRepository,
    private readonly teams: TeamRepository,
    private readonly tasks: TaskRepository
  ) {}

  @Log
  assignTask(developerId: number, taskId: number): string {
    const developer = this.developers.findById(developerId);
    const task = this.tasks.findById(taskId);
    if (!developer || !task) throw new Error("Developer or task not found");

    this.tasks.update(taskId, { assigneeId: developerId, status: "in-progress" });
    return `${task.title} assigned to ${developer.name}`;
  }

  findDevelopersByRole(role: DeveloperRole): DeveloperSummary[] {
    return this.developers.findByRole(role)
      .map(({ id, name, role: developerRole }) => ({ id, name, role: developerRole }));
  }

  updateDeveloper(id: number, changes: DeveloperUpdate): boolean {
    return this.developers.update(id, changes);
  }

  getTaskEvents(events: ProjectEvent[]): Array<Extract<ProjectEvent, { type: "task-completed" }>> {
    return events.filter(
      (event): event is TaskCompletedEvent => event.type === "task-completed"
    );
  }

  handleTaskCompleted(event: TaskCompletedEvent): void {
    console.log(`Task ${event.taskId} completed by developer ${event.developerId}`);
  }

  listDeveloperTeams(developerId: number): string[] {
    return this.teams.findByMember(developerId).map(team => team.name);
  }
}

const developers = new DeveloperRepository();
const teams = new TeamRepository();
const tasks = new TaskRepository();

developers.add({ id: 1, name: "Maya Chen", role: "frontend", experience: 5, active: true, specialty: "React" });
developers.add({ id: 2, name: "Omar Idrissi", role: "backend", experience: 8, active: true, specialty: "Node.js" });
developers.add({ id: 3, name: "Sofia Martins", role: "qa", experience: 4, active: true, specialty: "Automation" });

teams.add({ id: 1, name: "Platform", project: "DevFlow Core", memberIds: [1, 2, 3] });

tasks.add({ id: 101, title: "Build sprint dashboard", status: "todo", assigneeId: 1, storyPoints: 8 });
tasks.add({ id: 102, title: "Add project event API", status: "in-progress", assigneeId: 2, storyPoints: 5 });

const devFlow = new DevFlowService(developers, teams, tasks);

console.log("\n--- Assign a task ---");
console.log(devFlow.assignTask(1, 101));

console.log("\n--- Find developers by role ---");
console.log(devFlow.findDevelopersByRole("frontend"));

console.log("\n--- Update a developer ---");
devFlow.updateDeveloper(1, { experience: 6 });
console.log(developers.findById(1));

console.log("\n--- Team membership ---");
console.log(devFlow.listDeveloperTeams(1));

console.log("\n--- Type guard ---");
const unknownDeveloper: unknown = developers.findById(1);
if (isDeveloper(unknownDeveloper)) {
  console.log(`${unknownDeveloper.name} works as a ${unknownDeveloper.role} developer`);
}

console.log("\n--- Record utility type ---");
const workload: TeamWorkload = { frontend: 8, backend: 13, fullstack: 5, qa: 3 };
console.log(workload);

console.log("\n--- Extract task events ---");
const events: ProjectEvent[] = [
  { type: "task-created", taskId: 103, title: "Create activity feed" },
  { type: "task-completed", taskId: 102, developerId: 2 },
  { type: "developer-joined", developerId: 3, teamId: 1 }
];
console.log(devFlow.getTaskEvents(events));

// Compile-time demonstrations checked by TypeScript.
type AssignArguments = Parameters<DevFlowService["assignTask"]>;
type AssignResult = ReturnType<DevFlowService["assignTask"]>;
type TodoOutput = TaskStatusOutput<"todo">;
type DoneOutput = TaskStatusOutput<"done">;
type TaskItem = ArrayElement<ProjectTask[]>;
type ActiveTaskExample = ActiveTask;
type RemainingStatuses = OpenTaskStatus;
type StatusExample = TaskStatus;

const typeExamples: [
  AssignArguments, AssignResult, TodoOutput, DoneOutput, TaskItem,
  ActiveTaskExample["status"], RemainingStatuses, StatusExample
] | null = null;
void typeExamples;

console.log("\n--- Task completed event ---");
devFlow.handleTaskCompleted({ type: "task-completed", taskId: 102, developerId: 2 });

console.log("\n--- Validate story points ---");
tasks.add({ id: 103, title: "Create activity feed", status: "todo", assigneeId: 1, storyPoints: 3 });
try {
  tasks.add({ id: 104, title: "Invalid estimate", status: "todo", assigneeId: 2, storyPoints: -2 });
} catch (error) {
  console.log(error instanceof Error ? error.message : error);
}

console.log("\n--- Cache decorator ---");
class VelocityCalculator {
  @Cache
  calculateVelocity(completedPoints: number, sprintDays: number): number {
    console.log("Calculating velocity...");
    return completedPoints / sprintDays;
  }
}

const calculator = new VelocityCalculator();
console.log(calculator.calculateVelocity(30, 10));
console.log(calculator.calculateVelocity(30, 10));
console.log(calculator.calculateVelocity(20, 10));

console.log("\n--- Developer type guard ---");
const validDeveloper: unknown = { id: 10, name: "Lina Haddad", role: "fullstack", experience: 6, active: true };
const invalidDeveloper: unknown = { id: 11, name: "Alex", role: "designer", experience: 3, active: true };
console.log(isDeveloper(validDeveloper));
console.log(isDeveloper(invalidDeveloper));

