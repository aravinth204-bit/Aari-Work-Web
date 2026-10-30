export default function Loading() {
  return (
    <div
      aria-label="Loading page content"
      className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F3EC] px-4 py-20 text-[#3A2025]"
    >
      {/* Golden Thread Shimmer Animation */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[#B08A57]/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#B08A57] border-r-[#6B2638] border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Subtle needle icon inside */}
        <div className="text-[#B08A57]">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      </div>

      <p className="mt-5 text-sm tracking-wider uppercase font-semibold text-[#B08A57] animate-pulse">
        Tales by Threads
      </p>
      <p className="mt-1 text-xs text-[#541D2B]/70">
        வடிவமைப்புகள் தயாராகின்றன...
      </p>
    </div>
  );
}

