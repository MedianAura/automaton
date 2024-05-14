export abstract class BaseVersionType {
  protected digits: number[] = [];

  constructor(version?: string) {
    this.setVersion(version ?? '');
  }

  public setVersion(version: string): void {
    if (!version) return;

    this.digits = version.split('.').map((digit) => {
      if (Number.isNaN(Number.parseInt(digit, 10))) {
        throw new TypeError('Invalid version string');
      }
      return Number.parseInt(digit, 10);
    });
  }

  public getVersion(): string {
    return this.digits.join('.');
  }

  public bump(type: string): void {
    const bumpValue = this.getBumpChoices(type);

    for (let index = bumpValue; index < this.digits.length; index++) {
      if (index === bumpValue) {
        this.digits[index]++;
      } else {
        this.digits[index] = 0;
      }
    }
  }

  public abstract validate(version: string): boolean | string;

  public abstract getChoices(): string[];

  protected getBumpChoices(bump: string): number {
    switch (bump) {
      case 'Major': {
        return 0;
      }
      case 'Minor': {
        return 1;
      }
      case 'Patch': {
        return 2;
      }
      case 'Revision': {
        return 3;
      }
      default: {
        throw new Error('Invalid bump type');
      }
    }
  }
}
