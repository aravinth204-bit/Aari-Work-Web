import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F3EC] text-[#3A2025] flex flex-col justify-center items-center px-4 py-16 text-center">
      {/* Decorative Golden Needle & Thread Icon */}
      <div className="w-20 h-20 mb-6 rounded-full bg-[#B08A57]/10 border border-[#B08A57]/30 flex items-center justify-center text-[#B08A57] shadow-sm">
        <svg
          className="w-10 h-10 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      </div>

      <span className="text-xs uppercase tracking-widest text-[#B08A57] font-semibold mb-2">
        Tales by Threads • Bridal Atelier
      </span>

      <h1 className="text-4xl md:text-5xl font-serif text-[#6B2638] font-bold mb-4">
        பக்கம் கிடைக்கவில்லை (404)
      </h1>

      <p className="max-w-md text-base text-[#541D2B]/80 mb-8 leading-relaxed">
        நீங்கள் தேடும் பக்கம் இடம் மாறி இருக்கலாம் அல்லது நீக்கப்பட்டிருக்கலாம். கவலை வேண்டாம், எங்களின் பிரத்யேக மணப்பெண் ஆரி வேலைப்பாடுகளை பார்வையிட முகப்பு பக்கத்திற்கு செல்லலாம்.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#6B2638] text-[#F8F3EC] font-medium text-sm hover:bg-[#541D2B] transition-colors shadow-md"
        >
          முகப்புப் பக்கம் செல்ல
        </Link>
        <Link
          href="/#gallery"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#B08A57] text-[#6B2638] font-medium text-sm hover:bg-[#B08A57]/10 transition-colors"
        >
          Gallery பார்வையிட
        </Link>
      </div>
    </main>
  );
}

