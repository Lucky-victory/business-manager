import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Manager',
  description: 'Manage your business sales and credits with ease',
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
