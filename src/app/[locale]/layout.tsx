import { Space_Grotesk, DM_Sans, Press_Start_2P } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { yekanBakh } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GamingModeProvider } from "@/components/gaming/GamingModeProvider";
import { GamingLayer } from "@/components/gaming/GamingLayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://aidinsahebi.vercel.app",
    ),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      images: ["/images/profile-ai.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "fa" ? "rtl" : "ltr";
  const fontClass =
    locale === "fa"
      ? `${yekanBakh.variable} font-[family-name:var(--font-yekan-bakh)]`
      : `${spaceGrotesk.variable} ${dmSans.variable}`;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${fontClass} ${pressStart.variable} relative min-h-full antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <GamingModeProvider>
              <Header />
              <main className="relative z-10">{children}</main>
              <Footer />
              <GamingLayer />
            </GamingModeProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
