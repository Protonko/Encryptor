import {BmpParser} from './BmpParser';

export class Encryptor {
  /**
   * @readonly
   */
  #CHAR_BORDER = '∇'

  /**
   * @readonly
   */
  #offset = 0

  /**
   * @readonly
   */
  #STEP = 3

  /**
   * @type {DataView}
   */
  #view

  /**
   * @type {BmpParser}
   */
  #bmpParser

  /**
   * @param {ArrayBuffer} buffer
   */
  constructor(buffer) {
    this.#view = new DataView(buffer)
    this.#bmpParser = new BmpParser(this.#view)
  }

  /**
   * Converts binary code to text
   * @param {String} sValue
   * @returns {String}
   */
  decode(sValue) {
    console.log(sValue);
    console.log(String.fromCharCode(parseInt(sValue, 2)));
    return String.fromCharCode(parseInt(sValue, 2))
  }

  /**
   * Converts text to binary code
   * @param {String} sValue
   * @returns {Array.<String>}
   */
  encode(sValue) {
    return sValue.split('').map(char => char.charCodeAt(0).toString(2))
  }

  encrypt() {
    this.#offset = this.#bmpParser.offsetBits
    const aBinaryChars = this.encode(this.#CHAR_BORDER + 'Привет' + this.#CHAR_BORDER)
    aBinaryChars.join().split('').forEach(char => {
      if (this.#offset >= (this.#bmpParser.fileSize - this.#STEP)) {
        alert('Файл кончился!')
      }

      if (char === ',') this.#view.setUint8(this.#offset, 0)

      /** @todo: Исправить .setUint8() */
      this.#view.setUint8(this.#offset, +this.#view.getUint8(this.#offset) + +char)
      this.#offset++
    })


    return this.#view
    // console.log(this.decode('10001000000111')); // ∇
  }

  decipher() {
    let cycleInProgress = true
    this.#offset = this.#bmpParser.offsetBits
    let string = ''

    if (this.decode(this.#view.getUint8(this.#bmpParser.offsetBits)) !== this.#CHAR_BORDER) cycleInProgress = false

    while (cycleInProgress) {
      const char = this.decode(this.#view.getUint8(this.#offset))
      if (char === this.#CHAR_BORDER) cycleInProgress = false
      this.#offset++
      string += char
    }

    return string
  }
}
