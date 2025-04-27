import "../../styles/normalize.css";
import "../../styles/global.css";
import Providers from "../components/Providers";
import Header from "../components/Header";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <title>Studlar</title>
            </head>
            <body>
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <footer></footer>
                </Providers>
            </body>
        </html>
    );
}
