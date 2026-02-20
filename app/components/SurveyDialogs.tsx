"use client";

import { useState } from "react";
import Image from "next/image";
import { StickerTypes } from "../types/stickerTypes";

interface SurveyDialogsProps {
  onComplete: (name:string) => void;
}

type DialogStep =
  | "welcome"
  | "instructions-part1"
  | "instructions-part2"
  | "thank-you";

const SurveyDialogs = ({ onComplete }: SurveyDialogsProps) => {
  const [currentStep, setCurrentStep] = useState<DialogStep>("welcome");
  const [name, setName] = useState("");
  const [isResident, setIsResident] = useState(false);

  const handleProceed = () => {
    if (!isResident) {
      return; // don't proceed if checkbox is unchecked
    }
    setCurrentStep("instructions-part1");
  };

  const handleNext = () => {
    if (currentStep === "instructions-part1") {
      setCurrentStep("instructions-part2");
    } else if (currentStep === "instructions-part2") {
      setCurrentStep("thank-you");
    }
  };

  const handleBegin = () => {

    onComplete(name);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-[25px] shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] max-w-[70vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-2xl font-bold text-[#48BF7E] mb-2 text-center">
            Iloilo Food-Space Atlas
          </div>

          {currentStep === "welcome" && (
            <>
              <p className="text-gray-400 mb-6 text-sm text-center">
                Before proceeding, please answer the following:
              </p>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-[25px] focus:ring-2 focus:ring-[#48BF7E] focus:border-transparent outline-none text-gray-900 placeholder:text-gray-300 placeholder:text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Are you a resident of Iloilo City?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="resident"
                      checked={isResident}
                      onChange={(e) => setIsResident(e.target.checked)}
                      className="w-4 h-4 text-[#48BF7E] border-gray-300 rounded focus:ring-[#48BF7E]"
                    />
                    <label
                      htmlFor="resident"
                      className="ml-3 text-sm text-gray-700 cursor-pointer"
                    >
                      I am a resident of Iloilo City
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={!isResident}
                  className={`w-full py-3 px-6 rounded-[25px] font-medium transition-all ${
                    isResident
                      ? "bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Proceed
                </button>
              </div>
            </>
          )}

          {currentStep === "instructions-part1" && (
            <>
              <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                <p className="text-gray-400 mb-6 text-sm text-center">
                  Instructions on answering the survey:
                </p>
                <p>
                  This voluntary sticker-mapping survey is conducted as part of
                  a thesis project in partial fulfillment of the requirements
                  for the Bachelor of Science in Architecture at the University
                  of Santo Tomas – College of Architecture. The study is
                  entitled:
                </p>
                <div className="font-semibold text-center">
                  &quot;Digesting Architecture:
                  <p>
                    Analyzing the Relationship of Food and Space in Iloilo
                    City&quot;
                  </p>
                </div>
                <p>
                  Your participation will help explore how food spaces in Iloilo
                  City are experienced and understood through their
                  architectural and spatial expressions.
                </p>
              </div>
              <button
                onClick={handleNext}
                className="mt-6 w-full py-3 px-6 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all cursor-pointer"
              >
                Next
              </button>
            </>
          )}

          {currentStep === "instructions-part2" && (
            <>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-gray-400 mb-6 text-sm text-center">
                  Instructions on answering the survey:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Review the sticker codes provided.</li>
                  <div className="my-4 p-4 bg-gray-50 rounded-[25px]">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {StickerTypes.map((sticker) => (
                        <div
                          key={sticker.key}
                          className="flex flex-col items-center min-w-[80px]"
                        >
                          <Image
                            src={`/${sticker.key}.png`}
                            alt={sticker.label}
                            width={48}
                            height={48}
                            className="mb-1"
                          />
                          <span className="text-xs text-center text-gray-600">
                            {sticker.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <li>
                    Place stickers on the map according to how you perceive or
                    experience the space.
                  </li>
                  <li>
                    You may use as many or as few stickers as you like to
                    describe each location.
                  </li>
                  <li>
                    There are no right or wrong answers — your personal
                    perception and experience matter.
                  </li>
                  <li>
                    You may zoom in/out of the map using your mouse scroll wheel
                    or by clicking on the -/+ icons on the map.
                  </li>
                  <li>
                    You can undo placed stickers by clicking the undo button{" "}
                    <div className="bg-[#48BF7E] p-2 rounded-full flex items-center justify-center inline-block">
                      <Image
                        src="/icons/undo.svg"
                        alt="Undo icon"
                        width={20}
                        height={20}
                        className="brightness-0 invert"
                      />
                    </div>
                    .
                  </li>
                  <li>
                    Submit your answers by clicking the submit button
                    <button className="ml-2 p-2 w-20 rounded-full flex items-center justify-center bg-[#48BF7E]  text-md font-medium inline-block text-white">
                      Submit
                    </button>
                    .
                  </li>
                </ol>
              </div>
              <button
                onClick={handleNext}
                className="mt-6 w-full py-3 px-6 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all cursor-pointer"
              >
                Next
              </button>
            </>
          )}

          {currentStep === "thank-you" && (
            <>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="mt-4">
                  Thank you for contributing to this research. Your insights are
                  valuable in understanding the relationship between food and
                  space in Iloilo City.
                </p>
              </div>
              <button
                onClick={handleBegin}
                className="mt-6 w-full py-3 px-6 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all cursor-pointer"
              >
                Begin
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyDialogs;
