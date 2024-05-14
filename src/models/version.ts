import { BaseVersionType } from './versions/abstract-version.js';
import { ChromiumType } from './versions/chromium.js';
import { SemverType } from './versions/semver.js';
import { UnknownType } from './versions/unknown.js';

export class VersionModel {
  private version: BaseVersionType;

  constructor(version: string | undefined) {
    this.version = this.createVersionType(version);
  }

  public setVersion(version: string): void {
    if (this.version instanceof UnknownType) {
      this.version = this.createVersionType(version);
    }

    this.version.setVersion(version);
  }

  public getVersion(): string {
    return this.version.getVersion();
  }

  public validate(version: string): boolean | string {
    return this.version.validate(version);
  }

  public getChoices(): string[] {
    return this.version.getChoices();
  }

  public bump(type: string): void {
    this.version.bump(type);
  }

  private createVersionType(version: string | undefined): BaseVersionType {
    switch (version?.split('.').length) {
      case 4: {
        return new ChromiumType(version);
      }
      case 3: {
        return new SemverType(version);
      }
      default: {
        return new UnknownType(version);
      }
    }
  }
}
