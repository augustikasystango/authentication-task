import '../globals.css';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};
export default function AuthRootLayout({children})
{
    return (
        <html lang="en">
            <header id='auth-header'>
                <p>Welcome back</p>
            </header>
            <form>
                <button>Logout</button>
            </form>
          <body>{children}</body>
        </html>
      );
}