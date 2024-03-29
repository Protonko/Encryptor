import {BmpParser} from './BmpParser'
import {POSSIBLE_DIFFERENCE} from '../static'

export class Decipher {
  #offset = 0

  /**
   * @type {DataView}
   */
  #encryptedView

  /**
   * @type {DataView}
   */
  #viewKey

  /**
   * @type {BmpParser}
   */
  #bmpParserEncrypted

  /**
   * @type {BmpParser}
   */
  #bmpParserKey

  /**
   * @param {ArrayBuffer} encryptedBuffer
   * @param {ArrayBuffer} bufferKey
   */
  constructor(encryptedBuffer, bufferKey) {
    this.#encryptedView = new DataView(encryptedBuffer)
    this.#viewKey = new DataView(bufferKey)
    this.#bmpParserEncrypted = new BmpParser(encryptedBuffer)
    this.#bmpParserKey = new BmpParser(bufferKey)
  }

  /**
   * Конвертирует бинарный код в текст
   * @param {String} value
   * @returns {String}
   */
  decode(value) {
    return String.fromCharCode(parseInt(value, 2))
  }

  /**
   * @return {String}
   * @throws {Error}
   */
  decrypt() {
    this.#offset = this.#bmpParserKey.offsetBits

    let binaryChar = ''
    let string = ''

    while (true) {
      const encryptedByte = Math.abs(this.#encryptedView.getUint8(this.#offset) - this.#viewKey.getUint8(this.#offset))

      switch (encryptedByte) {
        case POSSIBLE_DIFFERENCE.EXIT_POINT:
          string += this.decode(binaryChar)
          return string
        case POSSIBLE_DIFFERENCE.SEPARATOR:
          string += this.decode(binaryChar)
          binaryChar = ''
          break
        case POSSIBLE_DIFFERENCE.BINARY_ONE:
        case POSSIBLE_DIFFERENCE.BINARY_ZERO:
          binaryChar += encryptedByte
          break
        default:
          throw new Error('Недопустимое значение!')
      }

      this.#offset++
    }
  }
}
