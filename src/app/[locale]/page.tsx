import { setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/components/pages/HomePageContent";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageContent />;
}
