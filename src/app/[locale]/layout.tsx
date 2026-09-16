import { Space_Grotesk, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { yekanBakh } from "@/lib/fonts";
import {
  SITE_NAME,
  SITE_URL,
  openGraphLocale,
  personJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { profile } from "@/content/profile";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { themeScript } from "@/components/providers/theme";
import { InlineScript } from "@/components/InlineScript";
import { GamingModeProvider } from "@/components/gaming/GamingModeProvider";
import { GamingLayerGate } from "@/components/gaming/GamingLayerGate";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#06060b" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: locale === "fa" ? `%s | آیدین صاحبی` : `%s | Aidin Sahebi`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: openGraphLocale(locale),
      images: [{ url: profile.portraitPath, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      images: [profile.portraitPath],
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
        <InlineScript html={themeScript} />
        <JsonLd data={[websiteJsonLd(locale), personJsonLd(locale)]} />
      </head>
      <body className={`${fontClass} relative min-h-full antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <GamingModeProvider>
              <a
                href="#main-content"
                className="sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:m-0 focus:inline-flex focus:h-auto focus:w-auto focus:overflow-visible focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:[clip:auto]"
              >
                {tNav("skipToContent")}
              </a>
              <div className="site-content">
                <Header />
                <main id="main-content" className="relative z-10" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </div>
              <GamingLayerGate />
            </GamingModeProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
