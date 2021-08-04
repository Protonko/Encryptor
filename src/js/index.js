import '../css/style.css'
import {Encryptor} from './Encryptor'
import {BmpParser} from './BmpParser'
import {Decipher} from './Decipher'

const ELEMENT_SELECTORS = {
  fileInput: '[data-file-input]',
  fileName: '[data-file-name]',
}

// nodes
const input = document.querySelector('[data-input]')
const commonFileInput = document.querySelector('[data-file-input="common"]')
const encryptedFileInput = document.querySelector('[data-file-input="encrypted"]')
const keyFileInput = document.querySelector('[data-file-input="key"]')
const decipherForm = document.querySelector('[data-form="decipher"]')
const encryptForm = document.querySelector('[data-form="encrypt"]')
const encryptCardFooter = encryptForm.querySelector('.card__footer')
const decipherCardFooter = decipherForm.querySelector('.card__footer')

const link = document.createElement('a')
link.download = 'encryptedFile.bmp'
link.className = 'link link--self-end'
link.innerText = 'Скачать'

encryptForm.addEventListener('submit', async event => {
  event.preventDefault()
  const buffer = await commonFileInput.files[0].arrayBuffer()
  const encryptionText = input.value
  const encryptor = new Encryptor(buffer, encryptionText, new BmpParser(buffer))
  link.href = URL.createObjectURL(new Blob([encryptor.encrypt()], {type: 'image/bmp'}))
  encryptCardFooter.appendChild(link)
  }
)

decipherForm.addEventListener('submit', async event => {
  event.preventDefault()
  const encryptedBuffer = await encryptedFileInput.files[0].arrayBuffer()
  const bufferKey = await keyFileInput.files[0].arrayBuffer()
  const decipher = new Decipher(encryptedBuffer, bufferKey, new BmpParser(bufferKey))
  decipherCardFooter.innerHTML =`<p>${decipher.decrypt()}</p>`
})

/**
 * Set file name on input
 */
document.addEventListener('change', event => {
  if (event.target.closest(ELEMENT_SELECTORS.fileInput)) {
    const fileInput = event.target
    fileInput.nextElementSibling.textContent = fileInput.files[0].name
  }
})
