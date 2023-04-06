import { SimpleIcon } from 'simple-icons';

export class Tech {
  name: string;
  icon: SimpleIcon;
  description: string;
  level: TechLevel;
  type: TechType;

  constructor(data: {
    name: string;
    icon: SimpleIcon;
    description: string;
    level: TechLevel;
    type: TechType;
  }) {
    this.name = data.name;
    this.icon = data.icon;
    this.description = data.description;
    this.level = data.level;
    this.type = data.type;
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
