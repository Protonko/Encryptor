import {BmpParser} from './BmpParser';

export class Encryptor {
  #offset = 0

  /**
   * @type {DataView}
   */
  #view

  /**
   * @type {String}
   */
  #encryptionText

  /**
   * @type {BmpParser}
   */
  #bmpParser

  /**
   * @param {ArrayBuffer} buffer
   * @param {String} encryptionText
   */
  constructor(buffer, encryptionText) {
    this.#view = new DataView(buffer)
    this.#encryptionText = encryptionText
    this.#bmpParser = new BmpParser(buffer)
  }

  /**
   * Конвертирует текст в бинарный код
   * @param {String} value
   * @returns {Array.<String>}
   */
  encode(value) {
    return value.split('').map(char => char.charCodeAt(0).toString(2))
  }

  /**
   * @throws {Error}
   */
  #checkOffsetOverflow() {
    if (this.#offset >= this.#bmpParser.fileSize) {
      throw new Error('Фраза слишком велика для данного файла!')
    }
  }

  /**
   * @return {DataView}
   * @throws {Error}
   */
  encrypt() {
    this.#offset = this.#bmpParser.offsetBits
    const binaryChars = this.encode(this.#encryptionText).join().split('')

    try {
      binaryChars.forEach(char => {
        this.#checkOffsetOverflow()
        const currentValue = +this.#view.getUint8(this.#offset)
        /** @todo Подумать, что делать если цвет 255 и мы добавляем еще 1 */
        const updatedValue = currentValue + (char === ',' ? 2 : +char)
        this.#view.setUint8(this.#offset, updatedValue)
        this.#offset++
      })
    } catch (error) {
      throw new Error(error.message)
    }

    // Добавляем точку выхода
    this.#view.setUint8(this.#offset, +this.#view.getUint8(this.#offset) + 3)

    return this.#view
  }
}
