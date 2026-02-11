import Image from "next/image";

const AsideImage = () => {
  return (
    <aside className="hidden lg:flex items-start py-6 justify-end">
      <div className="rounded-2xl">
        <Image
          src="/dog.jpg"
          alt="Dog Image"
          width={600}
          height={900}
          className="max-h-[80vh] rounded-xl object-cover"
        />
      </div>
    </aside>
  );
};

export default AsideImage;