import React from "react";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-600 text-white my-12 rounded-3xl shadow-xl overflow-hidden relative">
      <div className="flex flex-col items-start space-y-3 z-10 md:max-w-xl">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
          Farm Fresh Vegetables & Fruits Delivered Daily!
        </h2>
        <button className="mt-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm rounded-full shadow-md active:scale-95 transition">
          Start Shopping →
        </button>
      </div>

      <div className="mt-6 md:mt-0 z-10 flex items-center justify-center">
        <div className="w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-300/30">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop"
            alt="Fresh Vegetables Basket"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl"></div>
    </div>
  );
};

export default Banner;