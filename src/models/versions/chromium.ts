import { BaseVersionType } from './abstract-version.js';

export class ChromiumType extends BaseVersionType {
  private static readonly choices: string[] = ['Major', 'Minor', 'Patch', 'Revision', 'Manual'];

  public validate(version: string): boolean | string {
    if (/^(?:\d+\.){3}\d+$/.test(version)) {
      return true;
    }

    return 'Version must match pattern 0.0.0.0';
  }

  public getChoices(): string[] {
    return [...ChromiumType.choices];
  }
}
