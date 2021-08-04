import {Decipher} from '../services/Decipher'
import {BmpParser} from '../services/BmpParser'

/**
 * @param {String} text
 * @return {HTMLParagraphElement}
 */
const createDecryptedText = (text) => {
  const paragraph = document.createElement('p')
  paragraph.className = 'description'
  paragraph.innerText = text

  return paragraph
}

export const decipherForm = () => {
  const encryptedFileInput = document.querySelector('[data-file-input="encrypted"]')
  const keyFileInput = document.querySelector('[data-file-input="key"]')
  const decipherForm = document.querySelector('[data-form="decipher"]')
  const result = document.querySelector('[data-result]')

  decipherForm.addEventListener('submit', async event => {
    event.preventDefault()
    const encryptedBuffer = await encryptedFileInput.files[0].arrayBuffer()
    const bufferKey = await keyFileInput.files[0].arrayBuffer()
    const decipher = new Decipher(encryptedBuffer, bufferKey, new BmpParser(bufferKey))
    result.appendChild(createDecryptedText(decipher.decrypt()))
  })
}
