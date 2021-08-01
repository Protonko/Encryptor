import {BmpParser} from './BmpParser'

const input = document.getElementById('file-input')
const button = document.getElementById('decipher-button')

button.onclick = () => {
  console.log('click');
}

input.onchange = async event => {
  console.log(123);
  const buffer = await event.target.files[0].arrayBuffer()
  const link = document.createElement('a')
  const parserBMP = new BmpParser(buffer)
  link.download = 'test.bmp'
  link.innerText = 'Download'
  link.href = URL.createObjectURL(new Blob([parserBMP.encrypt()], {type: 'image/bmp'}))
  document.querySelector('.test').appendChild(link)
}
