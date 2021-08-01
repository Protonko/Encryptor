import {BmpParser} from './BmpParser';

export class Encryptor {
  #CHAR_BORDER = '∇'
  #offset = 0
  #STEP = 3
  #view
  #bmpParser

  /**
   * @param {ArrayBuffer} buffer
   */
  constructor(buffer) {
    this.#view = new DataView(buffer)
    this.#bmpParser = new BmpParser(this.#view)
  }
  /**
   * @param {String} sValue
   * @returns {String}
   */
  decode(sValue) {
    console.log(sValue);
    console.log(String.fromCharCode(parseInt(sValue, 2)));
    return String.fromCharCode(parseInt(sValue, 2))
  }

  /**
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
