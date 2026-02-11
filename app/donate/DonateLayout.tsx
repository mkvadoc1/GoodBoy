import AsideImage from "@/components/AsideImage";

export function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
      <main className="flex flex-col items-start justify-start">{children}</main>
      <AsideImage />
    </div>
  );
}
