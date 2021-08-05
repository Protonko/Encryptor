import {Decipher} from '../services/Decipher'
import {createDescription} from './createDescription'

export const decipherForm = () => {
  const encryptedFileInput = document.querySelector('[data-file-input="encrypted"]')
  const keyFileInput = document.querySelector('[data-file-input="key"]')
  const decipherForm = document.querySelector('[data-form="decipher"]')
  const result = document.querySelector('[data-result]')

  decipherForm.addEventListener('submit', async event => {
    event.preventDefault()
    const encryptedBuffer = await encryptedFileInput.files[0].arrayBuffer()
    const bufferKey = await keyFileInput.files[0].arrayBuffer()
    const decipher = new Decipher(encryptedBuffer, bufferKey)
    result.innerHTML = ''

    try {
      result.appendChild(createDescription(decipher.decrypt()))
    } catch (error) {
      result.appendChild(createDescription(error.message))
    }
  })
}
