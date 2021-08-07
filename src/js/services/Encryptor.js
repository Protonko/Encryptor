import {BmpParser} from './BmpParser'
import {MAX_HEXADECIMAL_VALUE, POSSIBLE_DIFFERENCE} from '../static'

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
   * @param {Number} binaryLength
   * @throws {Error}
   */
  #checkPhraseLength(binaryLength) {
    if (binaryLength >= this.#bmpParser.bitmapDataSize) {
      throw new Error('Фраза слишком велика для данного файла!')
    }
  }

  /**
   * @param {String|Number} char
   * @return {Number}
   */
  #updateUint8(char) {
    const currentValue = +this.#view.getUint8(this.#offset)
    const binaryChar = char === ',' ? POSSIBLE_DIFFERENCE.SEPARATOR : +char

    if (currentValue >= MAX_HEXADECIMAL_VALUE - POSSIBLE_DIFFERENCE.EXIT_POINT) {
      return currentValue - binaryChar
    }

    return currentValue + binaryChar
  }

  /**
   * @return {DataView}
   * @throws {Error}
   */
  encrypt() {
    this.#offset = this.#bmpParser.offsetBits
    const binaryChars = this.encode(this.#encryptionText).join().split('')

    this.#checkPhraseLength(binaryChars.length)

    binaryChars.forEach(char => {
      this.#view.setUint8(this.#offset, this.#updateUint8(char))
      this.#offset++
    })

    // Добавляем точку выхода
    this.#view.setUint8(this.#offset, this.#updateUint8(POSSIBLE_DIFFERENCE.EXIT_POINT))

    return this.#view
  }
}
