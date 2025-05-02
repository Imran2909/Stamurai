import Navbar from "./components/navbar/page";
import Sidebar from "./components/sidebar/page";
import "./globals.css";

export const metadata = {
  title: "Your App Title",
  description: "Your App Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div class="box">
          <div class="left">
            <Sidebar />
          </div>
          <div class="right">
            <div>
              <Navbar />
            </div>
            <div>
              { children }
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
