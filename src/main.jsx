import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { CardCanvas } from './CardCanvas.jsx'

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <CardCanvas/>
  </ChakraProvider>,
)
