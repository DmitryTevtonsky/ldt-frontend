import './globals.css'

export const metadata = {
	title: 'EventLoop?',
	description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}