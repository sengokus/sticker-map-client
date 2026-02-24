"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import SurveyDialogs from "./components/SurveyDialogs";
import { useSubmission } from "./components/SubmissionGuard";
import { mapDefaults } from "@/app/components/Map";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const Page = () => {
  const [showMap, setShowMap] = useState(false);
  const [username, setUsername] = useState<string>("");
  const { setSubmitted } = useSubmission();

  const onSurveyComplete = (name: string) => {
    setUsername(name);
    setShowMap(true);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen relative bg-white">
      <div className="mx-auto my-5 w-full h-250 relative z-10">
        <Map
          posix={mapDefaults.center}
          username={username}
          onSubmittedSuccess={setSubmitted}
        />
      </div>
      {!showMap && (
        <>
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[1999]" />
          <SurveyDialogs onComplete={onSurveyComplete} />
        </>
      )}
    </main>
  );
};

export default Page;
