import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutPageContent } from "@/components/pages/AboutPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("summary"),
    type: "profile",
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            locale,
            path: "/about",
            title: t("title"),
            description: t("summary"),
          }),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: tNav("about"), path: "/about" },
          ]),
        ]}
      />
      <AboutPageContent />
    </>
  );
}
