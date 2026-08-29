import React from "react";

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-200 mt-16 border-t border-emerald-800">
      <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-24 gap-10 py-12">
        <div className="md:w-2/5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white font-extrabold text-xl p-1.5 rounded-xl flex items-center justify-center">
              🥬
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">QuickCart</span>
            </div>
          </div>
          <p className="text-xs text-emerald-300 leading-relaxed">
            Fresh vegetables & fruits delivered directly to your kitchen.
          </p>
        </div>

        <div className="flex items-start justify-start md:justify-center gap-12 text-xs">
          <div>
            <h3 className="font-extrabold text-white mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2 text-emerald-300">
              <li><a className="hover:text-amber-300 transition" href="#">Fresh Fruits</a></li>
              <li><a className="hover:text-amber-300 transition" href="#">Fresh Vegetables</a></li>
              <li><a className="hover:text-amber-300 transition" href="#">Organic Leafy Greens</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-white mb-3 text-sm uppercase tracking-wider">Help & Support</h3>
            <div className="space-y-2 text-emerald-300">
              <p>📞 +91 9317401906</p>
              <p>📞 +91 8278776764</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-emerald-400 border-t border-emerald-900 bg-emerald-950/80">
        © 2026 QuickCart. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;