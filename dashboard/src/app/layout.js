import './style/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["greek"] })

export const metadata = {
  title: 'Kuroneko',
  description: 'Hi'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
