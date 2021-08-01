export class BmpParser {
  #BMP_HEADER_FIELD = 'BM'
  #view
  #decoder

  /**
   * @param {DataView} view
   */
  constructor(view) {
    this.#view = view
    this.#decoder = new TextDecoder()
    this.checkHeaderField()
  }

  /**
   * @returns {Boolean}
   */
  checkHeaderField() {
    if (this.#decoder.decode(new Uint8Array(this.#view.buffer, 0, 2)) !== this.#BMP_HEADER_FIELD) {
      throw new Error('Ожидается .bmp файл!')
    }
  }

  /**
   * @returns {Number}
   */
  get offsetBits() {
    return this.#view.getUint32(10, true)
  }

  /**
   * @returns {Number}
   */
  get fileSize() {
    return this.#view.getUint32(2, true)
  }
}
