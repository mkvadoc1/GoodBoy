import AsideImage from "@/components/AsideImage";
import Footer from "@/components/Footer";
import StepNavigation from "@/components/StepNavigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl flex flex-col px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 h-full w-full">
          <main className="flex flex-col items-start h-full">
            <div className="w-full flex-1">{children}</div>
            <div className="w-full my-6">
              <StepNavigation />
            </div>
            <Footer />
          </main>
          <AsideImage />
        </div>
      </div>
    </div>
  );
}
