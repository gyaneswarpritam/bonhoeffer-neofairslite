import TanstackProvider from '@/components/providers/TanstackProvider'
import './globals.css'
import { Inter } from 'next/font/google'
import axios from 'axios'
import { Providers } from '@/GlobalRedux/providers';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import GoogleTranslate from '@/components/GoogleTranslate';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NeoFairs',
  description: 'NeoFairs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ height: '100vh', overflowY: 'scroll' }}>
        <ToastContainer />
        <Providers>
          <TanstackProvider>
            {children}
          </TanstackProvider>
        </Providers>
        <GoogleTranslate />

      </body>
    </html>
  )
}
