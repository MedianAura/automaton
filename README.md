# Automaton

Create an automaton.config at the root of your project and add jobs and actions and then use automaton to run those action automatically.

[![Version](https://img.shields.io/npm/v/@medianaura/automaton.svg)](https://npmjs.org/package/@medianaura/automaton)
[![Downloads/week](https://img.shields.io/npm/dw/@medianaura/automaton.svg)](https://npmjs.org/package/@medianaura/automaton)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

- [Usage](#usage)

# Usage

```bash
automaton version
```

## Example

```ts
export default () => {
  return defineConfig({
    jobs: [
      {
        id: 'version',
        name: 'Create a new version',
        actions: [
          {
            type: 'run',
            run: (answers) => {
              if (!answers.confirm) {
                process.exit(4);
              }
            },
          },
          {
            type: 'cmd',
            cmd: 'automaton package',
          },
          {
            type: 'cmd',
            cmd: 'vc generate --no-commit --next %(version)s',
          },
          {
            type: 'cmd',
            cmd: 'npm version --force --no-git-tag-version %(version)s',
          },
          {
            type: 'cmd',
            cmd: 'git add .',
          },
          {
            type: 'cmd',
            cmd: 'git commit -m "doc: mise à jour du changelog pour la version %(version)s"',
          },
          {
            type: 'cmd',
            cmd: 'git tag -a v%(version)s -m "doc: creation de la version %(version)s"',
          },
          {
            type: 'cmd',
            cmd: 'git push',
          },
          {
            type: 'cmd',
            cmd: 'git push --tags --no-verify',
          },
          {
            type: 'cmd',
            cmd: 'npm publish',
          },
        ],
        prompts: [...getVersionPrompt()],
      },
    ],
  });
};
```
