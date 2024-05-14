import { BaseVersionType } from './abstract-version.js';

export class SemverType extends BaseVersionType {
  private static readonly choices: string[] = ['Major', 'Minor', 'Patch', 'Manual'];

  public validate(version: string): boolean | string {
    if (/^\d+\.\d+\.\d+$/.test(version)) {
      return true;
    }

    return 'Version must match pattern 0.0.0';
  }

  public getChoices(): string[] {
    return [...SemverType.choices];
  }
}
