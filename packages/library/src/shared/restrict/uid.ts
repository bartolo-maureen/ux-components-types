export class UID {

  private static instance: UID;

  private constructor() {
  }

  currentId: number = 0

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): UID {
    if (!UID.instance) {
      UID.instance = new UID();
    }

    return UID.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  public next(prefix: string): string {
    this.currentId++
    return prefix + this.currentId
  }
}
