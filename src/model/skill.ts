import { SimpleIcon } from 'simple-icons';

export interface Skill {
  name: string;
  icon: SimpleIcon;
  description: string;
  level: SkillLevel;
  type: SkillType;
}

export enum SkillLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4,
  Master = 5,
}

export enum SkillType {
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
