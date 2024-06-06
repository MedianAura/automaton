import { getLatestTag } from '../helpers/git-helper.js';
import { VersionModel } from '../models/version.js';
import { createPrompt } from './create-prompt.js';
import { asTypeValue } from './type-value.js';

export const getVersionPrompt = createPrompt(async (enquirer) => {
  const tag = getLatestTag();
  const version = new VersionModel(tag);

  const type = asTypeValue<{ version: string }>(
    await enquirer.prompt({
      type: 'select',
      name: 'version',
      message() {
        if (version.getVersion() === '') {
          return `What is the next version number?`;
        }
        return `What is the next version number? (${version.getVersion()})`;
      },
      choices: version.getChoices(),
    }),
  );

  if (type.version === 'Manual') {
    const manual = asTypeValue<{ version: string }>(
      await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Entrer le numero de version :',
        validate(value) {
          return version.validate(value);
        },
      }),
    );

    version.setVersion(manual.version);
  } else {
    version.bump(type.version);
  }

  const confirm = asTypeValue<{ confirm: boolean }>(
    await enquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      initial: true,
      message: () => {
        return `Next version will be ${version.getVersion()}`;
      },
    }),
  );

  return Object.assign({}, confirm, { version: version.getVersion() });
});
