import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { NextUIProvider } from "@nextui-org/react";
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Get a Laptop",
  description: "Looking for 'the perfect Laptop'? Tell us about your laptop needs by answering a few questions, and our advanced Machine Learning Model will recommend the most suitable laptops for you. Our system searches over 1,000 of the latest laptops and considers various factors such as your primary and secondary purposes, battery life expectations, screen size preferences, brand preferences, and weight preferences to provide personalized recommendations. Start now to find the perfect laptop that fits your specific requirements",
};

export default function RootLayout(
  { children }
) {
  return (

    <html lang="en">
      <body className={inter.className}>
        <Header />
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
