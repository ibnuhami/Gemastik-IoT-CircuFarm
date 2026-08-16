import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MqttProvider } from "@/context/MqttContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CircuFarm - Circular Farming IOT",
  description: "IoT-Based Circular Integrated Farming System",
  generator: "Trio KRL",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#10221f",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const MQTT_BROKER_URL = 'ws://192.168.18.29:9001';
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <MqttProvider brokerUrl={MQTT_BROKER_URL}>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </MqttProvider>
      </body>
    </html>
  );
}
