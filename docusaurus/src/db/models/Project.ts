import { SimpleIcon } from 'simple-icons';
import { Tech } from './Tech';

export class Project {
  constructor(
    public name: string,
    public description: string,
    public icon: SimpleIcon | string | null, // todo - add support for svg
    public date: Date,
    public priority: number, // 0~3
    public roles: ProjectRole[],
    public type: ProjectType,
    public techs: (Tech | string)[],
    public urls?: {
      url?: string;
      github?: string;
      googlePlay?: string;
      appStore?: string;
      youtube?: string;
    },
  ) {}
}

export enum ProjectRole {
  PROJECT_LEADER = 'Project Leader',
  FE_DEV = 'Frontend Developer',
  BE_DEV = 'Backend Developer',
  APP_DEV = 'App Developer',
  DEV_OPS = 'DevOps',
  DEV = 'Developer',
  DESIGNER = 'Designer',
  PM = 'Product Manager',
  QA = 'Quality Assurance',
  MARKETING = 'Marketing',
  OTHER = 'Other',
}

export enum ProjectType {
  PERSONAL = 'Personal',
  TEAM = 'Team',
  OUTSOURCE = 'Outsource',
  SCHOOL = 'School',
  OTHER = 'Other',
}
