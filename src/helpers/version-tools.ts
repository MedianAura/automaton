import type { AutomatonPromptType } from '../models/automaton.js';
import { VersionModel } from '../models/version.js';
import { getLatestTag } from './git-helper.js';

export function getVersionPrompt(): AutomatonPromptType[] {
  const tag = getLatestTag();
  const version = new VersionModel(tag);

  return [
    {
      type: 'select',
      name: 'version',
      message() {
        if (version.getVersion() === '') {
          return `What is the next version number?`;
        }
        return `What is the next version number? (${version.getVersion()})`;
      },
      choices: version.getChoices(),
      result(value: string) {
        if (value === 'Manual') return value;
        version.bump(value);
        return version.getVersion();
      },
    },
    {
      type: 'input',
      name: 'version',
      message: 'Entrer le numero de version :',
      validate: (value) => {
        return version.validate(value);
      },
      result: (value) => {
        version.setVersion(value);
        return version.getVersion();
      },
      skip: (answers: object) => {
        return (answers as Record<string, string>).version === 'Manual';
      },
    },
    {
      type: 'confirm',
      name: 'confirm',
      initial: true,
      message: () => {
        return `Next version will be ${version.getVersion()}`;
      },
    },
  ];
}
