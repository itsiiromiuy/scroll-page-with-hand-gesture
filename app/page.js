"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TensorflowModel from "./components/TensorflowModel";
import Lenis from "lenis";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set the flag when the component mounts on the client
  }, []);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const handleOnPrediction = (prediction) => {
    console.log(isScrolling);
    if (!prediction || isScrolling) return;

    const currentScrollY = window.scrollY;
    let targetScrollY = currentScrollY;
    console.log("pft", isScrolling);
    if (prediction.className === "touch left cheek") {
      targetScrollY += 100;
    } else if (prediction.className === "touch right cheek") {
      targetScrollY -= 100;
    }

    setIsScrolling(true);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    const checkScrollCompletion = () => {
      if (Math.abs(window.scrollY - targetScrollY) < 1) {
        setIsScrolling(false);
      } else {
        requestAnimationFrame(checkScrollCompletion);
      }
    };

    requestAnimationFrame(checkScrollCompletion);
  };
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/tutorial"); // Replace "/tutorial" with your target route
  };
  return (
    <div className="bg-[#F3F1EB] min-h-screen text-[#2E2E2E] font-roboto max-w-[989px] mx-auto border border-black">
      {/* Header */}
      <header className="flex justify-between items-center h-16 border-b border-black">
        <h1 className="text-sm tracking-wide ml-4">ITSYUIMORII</h1>
        <button className="text-xl mr-4">☰</button>
      </header>
      {/* Hero Section */}
      <section className="grid grid-cols-2 border-b border-black h-[calc(100vh-16rem)]">
        {/* Left Column */}
        <div className="border-r  border-black flex flex-col justify-center items-center ">
          <img
            src="/images/photo1.jpg"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right Column */}
        <div className="flex flex-col justify-end items-start ml-4 mb-4">
          <h2 className="text-[12px] font-roboto leading-snug uppercase">
            User Guide:
          </h2>
          <h2 className="text-[10px] font-roboto leading-snug uppercase mt-2 mb-6">
            Using Hand Gestures to Scroll a Webpage with TensorFlow.js
          </h2>
          <button className="mt-2 border border-black py-2 px-6 text-[12px] uppercase hover:bg-black mb-2 hover:text-white transition">
            Start Your Scroll with hand gesture
          </button>
        </div>
      </section>
      {/* Creative Method Section */}
      <section className="grid grid-cols-2 border-b border-black h-[calc(100vh-16rem)]">
        {/* Left Column */}
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-[10px] mt-10 mx-10 text-left max-w-md uppercase">
            i. The application uses a pre-trained pose estimation model loaded
            from Teachable Machine. <br />
            ii: The model detects hand gestures in real time via your webcam.
            <br />
            iii: Specific gestures (e.g., "touch left cheek" or "touch right
            cheek") trigger smooth scrolling up or down.
          </h3>
          <p className="text-sm ml-10 leading-loose text-center max-w-md"></p>
          <button
            onClick={handleOnClick}
            className="mt-6 mx-10 border border-black py-2 px-6 text-xs uppercase hover:bg-black hover:text-white transition"
          >
            check the tutorial{" "}
          </button>
        </div>
        {/* Right Column */}
        <div className="relative border-l border-black">
          <img
            src="/images/photo4.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 border border-black text-black text-sm px-2 py-1 rounded-full bg-[#F3F1EB]">
            02
          </div>
        </div>
      </section>
      {/* Portfolio Section */}
      <section className="grid grid-cols-4 border-b border-black">
        {/* Portfolio Items */}
        {[
          {
            title:
              "Requirements: A supported Web Browser: Chrome, Firefox, or Edge, A webcam and Good lighting",
          },
          { image: "/images/photo3.jpg" }, // Add image path here
          {
            title: "",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-start border-black ${
              index < 2 ? "border-r" : ""
            } h-[240px]`}
          >
            <h4 className="uppercase text-[10px] text-left mt-4 mx-4">
              {item.title}
            </h4>
          </div>
        ))}
      </section>
      <section className="grid grid-cols-4 border-b border-black">
        {/* Portfolio Items */}
        {[
          {
            title: "",
          },
          { image: "/images/photo3.jpg" }, // Add image path here
          {
            title: "",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-start border-black ${
              index < 2 ? "border-r" : ""
            } h-[240px]`}
          >
            {item.image ? ( // Check if the item has an image
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover mb-2" // Adjust styles for the image
              />
            ) : null}
            <h4 className="uppercase text-[10px] text-left mt-4 mx-4">
              {item.title}
            </h4>
          </div>
        ))}
      </section>
      {/* Client Words Section */}
      <section className="grid grid-cols-2 border-b border-black h-[calc(100vh-16rem)]">
        {/*
      <section className="grid grid-cols-2 border-b border-black h-[calc(100vh-16rem)]">
        {/* Left Column */}
        <div className="flex items-start mt-4 justify-center border-r border-black">
          <p className="text-[10px] uppercase text-left max-w-md">
            Testing the Application: 1. Position yourself in front of the
            webcam. 2. Perform one of the hand gestures (e.g., touch your left
            cheek). 3. Observe the page scrolling in the corresponding
            direction.
          </p>
        </div>
        {/* Right Column */}
        <div>
          <img
            src="/images/photo2.jpg"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#F3F1EB] text-[#2E2E2E] h-24 border-black flex justify-between items-center">
        <div className="ml-4">
          <p className="text-xs">© Design and Photos shot by itsyuimorii </p>
        </div>
        <div className="flex space-x-16 mr-4">
          <div>
            <h5 className="uppercase text-xs">Contact</h5>
            <p className="uppercase text-[10px]">
              <a
                href="mailto:itsyuimorii@example.com"
                className="hover:underline"
              >
                Email
              </a>
            </p>
            <p className="uppercase text-[10px]">
              <a href="/inquire" className="hover:underline">
                LInkedin
              </a>
            </p>
          </div>
          <div>
            <h5 className="uppercase text-xs">Social</h5>
            <p className="uppercase text-[10px]">
              <a
                href="https://instagram.com/itsyuimorii"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
            </p>
            <p className="uppercase text-[10px]">
              <a
                href="https://pinterest.com/itsyuimorii"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Pinterest
              </a>
            </p>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-40 right-4 bg-white p-4 rounded-lg shadow-lg z-20">
        <TensorflowModel onPrediction={handleOnPrediction} />
      </div>
    </div>
  );
}
