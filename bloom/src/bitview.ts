/**
 * A simple bitview for Array buffer.
 *
 * The DataView view provides a low-level interface for reading and writing
 * multiple number types in a binary ArrayBuffer, without having to care about the platform's endianness.
 *
 * @author: Joy Ghosh.
 * @version: 0.0.1
 */

const ENABLE_OUT_OF_BOUNDS_WARN = true;

export default class BitView {
  private unit8: Uint8Array;

  /**
   * Deserialize typed array from base 64 string
   */
  static from(asciiString: string) {
    const filter = new BitView(0);
    filter.unit8 = new Uint8Array(Buffer.from(asciiString, 'base64'));
    return filter;
  }

  /**
   * Constructor
   */
  constructor(size: number) {
    // typed array of 8-bit unsigned integers
    this.unit8 = new Uint8Array(size);
  }

  /**
   * Returns the bit value at position 'index'.
   */
  get(index: number): number {
    if (ENABLE_OUT_OF_BOUNDS_WARN && index >= this.unit8.length << 3) {
      console.warn('Out-of-bound access, index:', index);
    }

    const value = this.unit8[index >> 3];
    const offset = index & 0x7;
    return (value >> (7 - offset)) & 1;
  }

  /**
   * Sets the bit value at specified position 'index'.
   */
  set(index: number): void {
    if (ENABLE_OUT_OF_BOUNDS_WARN && index >= this.unit8.length << 3) {
      console.warn('Out-of-bound access, index:', index);
    }

    const offset = index & 0x7;
    this.unit8[index >> 3] |= 0x80 >> offset;
  }

  /**
   * Clears the bit at position 'index'.
   */
  clear(index: number): void {
    if (ENABLE_OUT_OF_BOUNDS_WARN && index >= this.unit8.length << 3) {
      console.warn('Out-of-bound access, index:', index);
    }

    const offset = index & 0x7;
    this.unit8[index >> 3] &= ~(0x80 >> offset);
  }

  /**
   * Returns the byte length of this array buffer.
   */
  get length(): number {
    return this.unit8.byteLength;
  }

  /**
   * Returns the array buffer.
   */
  view(): Uint8Array {
    return this.unit8;
  }

  /**
   * Serialize typed array as base 64 string
   */
  serialize(): string {
    return Buffer.from(this.unit8).toString('base64');
  }
}
