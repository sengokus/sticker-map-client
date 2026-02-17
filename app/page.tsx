"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import SurveyDialogs from "./components/SurveyDialogs";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const Page = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen relative bg-white">
      <div className="mx-auto my-5 w-full h-250 relative z-10">
        <Map posix={[10.7302, 122.5591]} />
      </div>
      {!showMap && (
        <>
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[1999]" />
          <SurveyDialogs onComplete={() => setShowMap(true)} />
        </>
      )}
    </main>
  );
};

export default Page;
