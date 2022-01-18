/**
 * A simple bitview for Array buffer.
 *
 */

export default class BitView {
  private data: boolean[];

  /**
   * Deserialize typed array from base 64 string
   */
  static from(asciiString: string) {
    const filter = new BitView(0);
    filter.data = asciiString.split(',').map((x) => Boolean(Number(x)));
    return filter;
  }

  /**
   * Constructor
   */
  constructor(size: number) {
    // typed array of 8-bit unsigned integers
    this.data = new Array(size);
  }

  /**
   * Returns the bit value at position 'index'.
   */
  get(index: number): number {
    return this.data[index] ? 1 : 0;
  }

  /**
   * Sets the bit value at specified position 'index'.
   */
  set(index: number): void {
    this.data[index] = true;
  }

  /**
   * Clears the bit at position 'index'.
   */
  clear(index: number): void {
    delete this.data[index];
  }

  /**
   * Returns the byte length of this array buffer.
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * Returns the array buffer.
   */
  view(): boolean[] {
    return this.data;
  }

  /**
   * Serialize typed array as base 64 string
   */
  serialize(): string {
    return [...this.data].map((x) => (x ? 1 : 0)).join(',');
  }
}
