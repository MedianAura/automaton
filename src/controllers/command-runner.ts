import chalk from 'chalk';
import { cosmiconfig, type CosmiconfigResult } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import Enquirer from 'enquirer';
import { execaCommand } from 'execa';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { sprintf } from 'sprintf-js';
import type { Primitive } from 'zod';
import { Logger } from '../helpers/logger.js';
import type { AutomatonConfigModel, AutomatonPromptFunction, AutomatonPromptResult } from '../models/automaton.js';
import { ConfigurationNotFoundError } from '../models/errors.js';

export class CommandRunner {
  public async run(jobName: string | undefined, answerFile: string | undefined): Promise<void> {
    const result = await this.getConfig();

    if (result === null) {
      throw new ConfigurationNotFoundError('Configuration file not found');
    }

    const config = await this.parseConfig(result.config);

    const job = config.jobs.find((index) => index.id === jobName);

    if (!job) {
      throw new Error(`Job <${jobName}> not found.`);
    }

    Logger.println(`Executing Job : ${chalk.cyanBright(job.name)}`);

    let answers: Record<string, Primitive> = {};
    if (answerFile) {
      answers = JSON.parse(readFileSync(path.resolve(answerFile.toString()), { encoding: 'utf8' }));
    }

    if (job.prompts) {
      for (const question of job.prompts) {
        const response = await this.getPrompt(question);
        if (response) {
          answers = { ...answers, ...response };
        }
      }
    }

    for await (const action of job.actions) {
      if (action.when && !(await action.when(answers))) {
        continue;
      }

      switch (action.type) {
        case 'cmd': {
          const command = sprintf(action.cmd, answers);
          Logger.info(`Executing command : ${chalk.cyanBright(command)}`);
          await execaCommand(command, { stdio: 'inherit', windowsVerbatimArguments: true });
          break;
        }
        case 'run': {
          Logger.info(`Executing custom function`);
          await action.run(answers);
          break;
        }
      }
    }

    Logger.success('Job executed successfully');
  }

  private async parseConfig(config: unknown): Promise<AutomatonConfigModel> {
    if (typeof config === 'function') {
      return config();
    }

    return config as AutomatonConfigModel;
  }

  private async getConfig(): Promise<CosmiconfigResult> {
    return cosmiconfig('automaton', {
      loaders: {
        '.ts': TypeScriptLoader(),
        '.cts': TypeScriptLoader(),
        '.mts': TypeScriptLoader(),
      },
      searchPlaces: [`automaton.config.js`, `automaton.config.ts`, `automaton.config.mjs`, `automaton.config.cjs`, `automaton.config.mts`, `automaton.config.cts`],
    }).search(process.cwd());
  }

  private async getPrompt(config: AutomatonPromptFunction): AutomatonPromptResult {
    return config(new Enquirer());
  }
}
