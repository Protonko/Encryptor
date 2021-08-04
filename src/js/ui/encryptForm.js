import {Encryptor} from '../services/Encryptor'
import {BmpParser} from '../services/BmpParser'

/**
 * @param {String} href
 * @return {HTMLAnchorElement}
 */
const createLink = (href) => {
  const link = document.createElement('a')
  link.download = 'encryptedFile.bmp'
  link.className = 'link link--self-end'
  link.innerText = 'Скачать'
  link.href = href

  return link;
}

export const encryptForm = () => {
  const input = document.querySelector('[data-input]')
  const commonFileInput = document.querySelector('[data-file-input="common"]')
  const encryptForm = document.querySelector('[data-form="encrypt"]')
  const encryptCardFooter = encryptForm.querySelector('.card__footer')

  encryptForm.addEventListener('submit', async event => {
      event.preventDefault()
      const buffer = await commonFileInput.files[0].arrayBuffer()
      const encryptionText = input.value
      const encryptor = new Encryptor(buffer, encryptionText, new BmpParser(buffer))
      encryptCardFooter.appendChild(createLink(URL.createObjectURL(new Blob([encryptor.encrypt()], {type: 'image/bmp'}))))
    }
  )
}
