export class BmpParser {
  // 0 - 14 BITMAPFILEHEADER
  // 14 - 54 BITMAPINFOHEADER
  #BMP_HEADER_FIELD = 'BM'
  #CHAR_BORDER = '∇'
  #STEP = 3
  #offset = 0
  #buffer
  #view
  #decoder

  /**
   * @param {ArrayBuffer} buffer
   */
  constructor(buffer) {
    this.#buffer = buffer
    this.#view = new DataView(buffer)
    this.#decoder = new TextDecoder()

    if (!this.checkHeaderField()) {
      alert('Ожидается .bmp файл!')
    }
  }

  /**
   * @returns {Boolean}
   */
  checkHeaderField() {
    return this.#decoder.decode(new Uint8Array(this.#buffer, 0, 2)) === this.#BMP_HEADER_FIELD
  }

  /**
   * @param {Number} nOffset
   * @returns {{r: number, b: number, g: number}}
   */
  getRGB(nOffset) {
    if (!nOffset) {
      throw new Error('Отсутствует параметр nOffset!')
    }

    if (typeof nOffset !== 'number') {
      throw new Error('параметр nOffset должен быть типа number!')
    }

    return {
      r: this.#view.getUint8(this.#offset + 3),
      g: this.#view.getUint8(this.#offset + 2),
      b: this.#view.getUint8(this.#offset + 1),
    }
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
    this.#offset = this.offsetBits
    const aBinaryChars = this.encode(this.#CHAR_BORDER + 'Привет' + this.#CHAR_BORDER)
    aBinaryChars.join().split('').forEach(char => {
      if (this.#offset >= (this.fileSize - this.#STEP)) {
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

  decrypt() {
    let cycleInProgress = true
    this.#offset = this.offsetBits
    let string = ''

    if (this.decode(this.#view.getUint8(this.offsetBits)) !== this.#CHAR_BORDER) cycleInProgress = false

    while (cycleInProgress) {
      const char = this.decode(this.#view.getUint8(this.#offset))
      if (char === this.#CHAR_BORDER) cycleInProgress = false
      this.#offset++
      string += char
    }

    return string
  }

  #toBlack() {
    this.#view.setUint8(this.#offset + 3, 0)
    this.#view.setUint8(this.#offset + 2, 0)
    this.#view.setUint8(this.#offset + 1, 0)
  }

  parse() {
    this.#offset = this.offsetBits

    // TODO: Последний бит не красится
    while (this.#offset < (this.fileSize - this.#STEP)) {
      this.#toBlack()
      this.#offset += this.#STEP
    }

    return this.#view
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

  /**
   * @returns {Number}
   */
  get bitMapInfoHeaderSize() {
    return this.#view.getUint32(14, true)
  }

  /**
   * @returns Number}
   */
  get compressionMethod() {
    return this.#view.getUint32(30, true)
  }

  /**
   * @returns {Number}
   */
  get colorsNumberInColorPalette() {
    return this.#view.getUint32(46, true)
  }
}
