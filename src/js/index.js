import '../css/style.css'
import {fileInput} from './ui/fileInput'
import {decipherForm} from './ui/decipherForm'
import {encryptForm} from './ui/encryptForm'

window.addEventListener('DOMContentLoaded', () => {
  fileInput()
  decipherForm()
  encryptForm()
})
