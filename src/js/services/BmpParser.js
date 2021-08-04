export class BmpParser {
  /**
   * @readonly
   */
  #BMP_HEADER_FIELD = 'BM'

  /**
   * @type {DataView}
   */
  #view

  /**
   * @type {TextDecoder}
   */
  #decoder

  /**
   * @param {ArrayBuffer} buffer
   */
  constructor(buffer) {
    this.#view = new DataView(buffer)
    this.#decoder = new TextDecoder()
    this.#checkHeaderField()
  }

  /**
   * Проверка на соответствие файла .bmp формату
   */
  #checkHeaderField() {
    if (this.#decoder.decode(new Uint8Array(this.#view.buffer, 0, 2)) !== this.#BMP_HEADER_FIELD) {
      throw new Error('Ожидается .bmp файл!')
    }
  }

  /**
   * Смещение, где может быть найден массив пикселей (bitmap data)
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
