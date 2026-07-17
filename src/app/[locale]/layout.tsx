import { Space_Grotesk, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { yekanBakh } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { GamingModeProvider } from "@/components/gaming/GamingModeProvider";
import { GamingLayer } from "@/components/gaming/GamingLayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    title: {
      default: t("title"),
      template: locale === "fa" ? `%s | آیدین صاحبی` : `%s | Aidin Sahebi`,
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fa: "/fa",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      images: ["/images/profile-ai.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const dir = locale === "fa" ? "rtl" : "ltr";
  const fontClass =
    locale === "fa"
      ? `${yekanBakh.variable} font-[family-name:var(--font-yekan-bakh)]`
      : `${spaceGrotesk.variable} ${dmSans.variable}`;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${fontClass} relative min-h-full antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <GamingModeProvider>
              <a
                href="#main-content"
                className="sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:m-0 focus:inline-flex focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:[clip:auto]"
              >
                {tNav("skipToContent")}
              </a>
              <Header />
              <main id="main-content" className="relative z-10" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <GamingLayer />
            </GamingModeProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
