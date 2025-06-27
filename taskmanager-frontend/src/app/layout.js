import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserProvider } from "../Context/UserContext";

export const metadata = {
  title: "Task Manager",
  description: "Manage your projects and tasks efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ClientLayout>{children}</ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}

import ClientLayout from "./client-layout";
