import {Encryptor} from '../services/Encryptor'
import {createDescription} from './createDescription'
import {createLink} from './createLink'

export const encryptForm = () => {
  const input = document.querySelector('[data-input]')
  const commonFileInput = document.querySelector('[data-file-input="common"]')
  const encryptForm = document.querySelector('[data-form="encrypt"]')
  const encryptCardFooter = encryptForm.querySelector('.card__footer')

  encryptForm.addEventListener('submit', async event => {
      event.preventDefault()
      const buffer = await commonFileInput.files[0].arrayBuffer()
      const encryptionText = input.value
      const encryptor = new Encryptor(buffer, encryptionText)

      try {
        encryptCardFooter.appendChild(createLink(URL.createObjectURL(new Blob([encryptor.encrypt()], {type: 'image/bmp'}))))
      } catch (error) {
        encryptCardFooter.appendChild(createDescription(error.message))
      }
    }
  )
}
