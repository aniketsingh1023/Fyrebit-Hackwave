"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, TrendingUp, User, FileText, Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarItems = [
    { id: "home", icon: Home, label: "Home", href: "/home" },
    { id: "trendz", icon: TrendingUp, label: "Trendz", href: "/trendz" },
    { id: "posts", icon: FileText, label: "Posts", href: "/posts" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  
  useEffect(() => {
    const currentPath = pathname;
    const activeItem = sidebarItems.find((item) => item.href === currentPath);
    if (activeItem) {
      setActiveTab(activeItem.id);
    }
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed top-6 left-6 z-[100] w-12 h-12 bg-black/90 backdrop-blur-sm border border-stone-700 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-100 hover:bg-stone-900/90 transition-all duration-300"
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div
        className={`
        fixed z-[95] bg-black/90 backdrop-blur-sm border border-stone-700 transition-all duration-500 ease-out
        ${
          isMobile
            ? `top-0 left-0 h-full ${
                isExpanded ? "w-80" : "w-0 overflow-hidden"
              } rounded-none`
            : `left-6 top-1/2 -translate-y-1/2 ${
                isExpanded ? "w-64" : "w-20"
              } rounded-2xl hover:w-64`
        }
      `}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        {/* Brand/Logo Section - Mobile */}
        {isMobile && (
          <div className="p-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">W</span>
              </div>
              <div
                className={`transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <h2 className="text-stone-200 font-light text-xl tracking-wider">
                  WEARLY
                </h2>
                <p className="text-stone-500 text-xs uppercase tracking-wider">
                  FASHION AI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav
          className={`flex flex-col ${isMobile ? "p-6 pt-0" : "p-4"} ${
            isMobile ? "gap-2" : "gap-3"
          }`}
        >
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative group flex items-center transition-all duration-300 ${
                  isMobile ? "p-4" : "p-3"
                } ${
                  isActive
                    ? "bg-stone-200 text-black rounded-xl shadow-lg"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50 rounded-xl"
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsExpanded(false);
                }}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isExpanded
                    ? "slideIn 0.3s ease-out forwards"
                    : "none",
                }}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 ${isMobile ? "" : "w-6"}`}>
                  <Icon size={20} />
                </div>

                {/* Label */}
                <span
                  className={`ml-4 font-light tracking-wide transition-all duration-300 whitespace-nowrap ${
                    isMobile
                      ? isExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                      : isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-black rounded-full animate-pulse" />
                )}

                {/* Desktop Tooltip - Only show when collapsed */}
                {!isMobile && !isExpanded && (
                  <div className="absolute left-16 bg-stone-100 text-black text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg font-light z-10">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stone-100 rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Profile Quick Access */}
        {isExpanded && (
          <div
            className={`mt-auto ${
              isMobile ? "p-6" : "p-4"
            } border-t border-stone-800`}
          >
            <div className="flex items-center gap-3 p-3 hover:bg-stone-800/50 rounded-xl transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-stone-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-stone-300" />
              </div>
              <div
                className={`transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-stone-300 text-sm font-light">Profile</p>
                <p className="text-stone-500 text-xs">Settings & more</p>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Indicator - Desktop Only */}
        {!isMobile && (
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center shadow-lg">
            <div
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="text-black"
              >
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
