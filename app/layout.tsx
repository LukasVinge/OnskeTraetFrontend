import './globals.css'
import { SupabaseProvider } from './providers'

export const metadata = {
  title: 'Wishlist App',
  description: 'A wishlist app with Supabase Auth',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
