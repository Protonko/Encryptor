import {Encryptor} from './Encryptor';

const input = document.getElementById('file-input')
const button = document.getElementById('decipher-button')

button.onclick = () => {
  console.log('click');
}

input.onchange = async event => {
  const buffer = await event.target.files[0].arrayBuffer()
  const link = document.createElement('a')
  const encryptor = new Encryptor(buffer)
  link.download = 'test.bmp'
  link.innerText = 'Download'
  link.href = URL.createObjectURL(new Blob([encryptor.encrypt()], {type: 'image/bmp'}))
  document.querySelector('.test').appendChild(link)
}
