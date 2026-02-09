"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const page = () => {
  return (
    <div className="bg-amber-100 mx-auto my-5 w-[98%] h-[1000px]">
      <Map posix={[10.7302, 122.5591]} />
    </div>
  );
};

export default page;
