import React from "react";

const grocerySpotlights = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop",
    title: "Organic Farm Vegetables",
    description: "Potato, Tomato, Onion, Okra & Cauliflower — 100% Direct farm sourced.",
    tag: "Fresh Sourced"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop",
    title: "Sweet & Juicy Fruits",
    description: "Apples, Pomegranates, Bananas, Mangoes & Kiwis — Quality guaranteed.",
    tag: "Super Fresh"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop",
    title: "Fresh Green Produce",
    description: "Bottle Gourd, Bitter Gourd, Cucumber, Capsicum & Green Beans.",
    tag: "Express 15M"
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">Featured Produce Spotlights</h2>
        <p className="text-xs md:text-sm text-emerald-700 font-bold mt-1">Daily Morning Fresh Sourcing</p>
        <div className="w-24 h-1 bg-emerald-600 rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {grocerySpotlights.map(({ id, image, title, description, tag }) => (
          <div key={id} className="relative group rounded-2xl overflow-hidden shadow-md h-64 border border-emerald-100">
            <img
              src={image}
              alt={title}
              className="group-hover:scale-105 transition duration-500 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              {tag}
            </span>

            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <p className="font-extrabold text-xl">{title}</p>
              <p className="text-xs text-gray-200 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
