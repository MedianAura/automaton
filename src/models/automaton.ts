import type Enquirer from 'enquirer';
import type { Primitive } from 'zod';

export type EnquirerInstance = Enquirer;

export type AutomatonPromptResult = Promise<Record<string, Primitive> | undefined>;

export type AutomatonPromptFunction = (prompt: EnquirerInstance) => AutomatonPromptResult;

export type ActionsTypes = 'cmd' | 'run';

export type ActionCommandModel = {
  type: 'cmd';
  cmd: string;
} & ActionModel;

export type ActionRunModel = {
  type: 'run';
  run: (answers: Record<string, Primitive>) => Promise<void> | void;
} & ActionModel;

export type ActionModel = {
  type: ActionsTypes;
  when?: (answers: Record<string, Primitive>) => Promise<boolean>;
};

export type ActionsModel = ActionCommandModel | ActionRunModel;

export type JobModel = {
  id: string;
  name: string;
  actions: ActionsModel[];
  prompts?: AutomatonPromptFunction[];
};

export type AutomatonConfigModel = {
  jobs: JobModel[];
};
