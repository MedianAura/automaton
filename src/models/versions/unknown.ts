import { BaseVersionType } from './abstract-version.js';

export class UnknownType extends BaseVersionType {
  public validate(version: string): boolean | string {
    if (/^(?:\d+\.){3}\d+$/.test(version)) {
      return true;
    }

    if (/^\d+\.\d+\.\d+$/.test(version)) {
      return true;
    }

    return 'Version must match pattern 0.0.0.0 or 0.0.0';
  }

  public getChoices(): string[] {
    return ['Manual'];
  }
}
