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
   * @param {BmpParser} bmpParser
   */
  constructor(buffer, encryptionText, bmpParser) {
    this.#view = new DataView(buffer)
    this.#encryptionText = encryptionText
    this.#bmpParser = bmpParser
  }

  /**
   * Конвертирует текст в бинарный код
   * @param {String} value
   * @returns {Array.<String>}
   */
  encode(value) {
    return value.split('').map(char => char.charCodeAt(0).toString(2))
  }

  encrypt() {
    this.#offset = this.#bmpParser.offsetBits
    const binaryChars = this.encode(this.#encryptionText).join().split('')

    binaryChars.forEach(char => {
      const currentValue = +this.#view.getUint8(this.#offset)
      /** @todo Подумать, что делать если цвет 255 и мы добавляем еще 1 */
      const updatedValue = currentValue + (char === ',' ? 2 : +char)

      /** @todo Подумать, что делать если фраза больше файла */
      if (this.#offset >= this.#bmpParser.fileSize) {
        alert('Файл кончился!')
      }

      this.#view.setUint8(this.#offset, updatedValue)
      this.#offset++
    })

    // Добавляем точку выхода
    this.#view.setUint8(this.#offset, +this.#view.getUint8(this.#offset) + 3)

    return this.#view
  }
}
