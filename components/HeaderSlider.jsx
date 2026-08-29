import React, { useState, useEffect } from "react";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Fresh Vegetables & Sweet Fruits",
      buttonText1: "Buy Now",
      buttonText2: "View Catalog",
      imgUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Desi Aloo, Tamatar, Pyaz & Bhindi at Best Wholesale Prices!",
      buttonText1: "Order Now",
      buttonText2: "View Catalog",
      imgUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Juicy Mangoes, Apples, Pomegranates & Bananas",
      buttonText1: "Order Fruits",
      buttonText2: "View Catalog",
      imgUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative overflow-hidden w-full rounded-3xl mt-4">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-700 text-white py-8 md:px-14 px-6 rounded-3xl min-w-full shadow-lg"
          >
            <div className="md:w-3/5 mt-6 md:mt-0 space-y-3">
              <h1 className="md:text-[36px] md:leading-[44px] text-2xl font-extrabold tracking-tight">
                {slide.title}
              </h1>
              <p className="text-emerald-100 text-xs md:text-sm font-medium">
                Quantities available from 500g to 10kg.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm rounded-full shadow-md active:scale-95 transition">
                  {slide.buttonText1}
                </button>
                <button className="px-6 py-3 border border-emerald-300 hover:bg-emerald-800 text-white font-bold text-sm rounded-full transition">
                  {slide.buttonText2}
                </button>
              </div>
            </div>

            <div className="flex items-center md:w-2/5 justify-center relative">
              <div className="w-56 h-56 md:w-72 md:h-72 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-400/30">
                <img
                  src={slide.imgUrl}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  {slide.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === index ? "w-8 bg-emerald-600" : "w-2.5 bg-emerald-200"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
