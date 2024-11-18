import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:4000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"], // 일본어 텍스트를 위해 japanese 추가
  weight: ["400", "700"], // 필요한 폰트 두께 지정
  display: "swap", // FOUT 방지
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center bg-[#191919]">
            {/* <div className="flex-1 w-full flex flex-col gap-20 items-center"> */}
            <div className="flex flex-col gap-20 w-full p-5">{children}</div>
            {/* </div> */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
