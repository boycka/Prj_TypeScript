import type { Developer, NewDeveloper, ProjectTask, Team } from "./types";
import { Log, MeasureTime, ValidateStoryPoints } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);
    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class DeveloperRepository extends Repository<Developer> {
  addDeveloper(data: NewDeveloper): Developer {
    const developers = this.getAll();
    const newId = developers.length > 0
      ? Math.max(...developers.map(developer => developer.id)) + 1
      : 1;

    const developer: Developer = { ...data, id: newId };
    this.add(developer);
    return developer;
  }

  findByRole(role: Developer["role"]): Developer[] {
    return this.getAll().filter(developer => developer.role === role);
  }
}

export class TeamRepository extends Repository<Team> {
  findByMember(developerId: number): Team[] {
    return this.getAll().filter(team => team.memberIds.includes(developerId));
  }
}

export class TaskRepository extends Repository<ProjectTask> {
  @ValidateStoryPoints
  override add(task: ProjectTask): void {
    super.add(task);
  }

  findByAssignee(developerId: number): ProjectTask[] {
    return this.getAll().filter(task => task.assigneeId === developerId);
  }
}

