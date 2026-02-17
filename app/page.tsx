"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const page = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <div className="mx-auto my-5 w-full h-250">
        <Map posix={[10.7302, 122.5591]} />
      </div>
    </main>
  );
};

export default page;
