import {BmpParser} from './BmpParser';

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
   * @throws {Error}
   */
  #checkForEncryptedMessage() {
    if (this.#bmpParserEncrypted.applicationDefinedIdentifier === this.#bmpParserKey.applicationDefinedIdentifier) {
      throw new Error('Зашифрованного сообщения нет!')
    }
  }

  /**
   * @return {String}
   * @throws {Error}
   */
  decrypt() {
    this.#checkForEncryptedMessage()
    this.#offset = this.#bmpParserKey.offsetBits

    let isReadingFinished = false
    let binaryChar = ''
    let string = ''

    while (!isReadingFinished) {
      /**
       * Возможные значения:
       * 0, 1 - часть символа
       * 2 - запятая
       * 3 - точка выхода
       */
      const encryptedByte = this.#encryptedView.getUint8(this.#offset) - this.#viewKey.getUint8(this.#offset)

      switch (encryptedByte) {
        case 3:
          string += this.decode(binaryChar)
          isReadingFinished = true
          break
        case 2:
          string += this.decode(binaryChar)
          binaryChar = ''
          break
        case 1:
        case 0:
          binaryChar += encryptedByte
          break
        default:
          throw new Error('Недопустимое значение!')
      }

      this.#offset++
    }

    return string
  }
}
