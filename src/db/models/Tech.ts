import { SimpleIcon } from 'simple-icons';

export class Tech {
  constructor(
    public name: string,
    public icon: SimpleIcon,
    public description: string,
    public level: TechLevel,
    public type: TechType,
  ) {}

  toString() {
    return this.name;
  }
}

export enum TechLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4,
  Master = 5,
}

export enum TechType {
  Language = 'Language',
  Framework = 'Framework',
  Library = 'Library',
  Tool = 'Tool',
  Database = 'Database',
  Platform = 'Platform',
  IDE = 'IDE',
  Social = 'Social',
  Gaming = 'Gaming',
  Protocol = 'Protocol',
  OperatingSystem = 'OperatingSystem',
  CICD = 'CI/CD',
}
