import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import symmetriLogo from "@assets/newsymmlogo_1764585841560.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-testid="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#050505] border-b border-white/10" 
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-[110px] md:mr-[110px]">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a 
            href="#" 
            className="flex items-center group overflow-visible"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            data-testid="link-logo"
          >
            <img 
              src={symmetriLogo} 
              alt="SymmetriLabs" 
              className="h-24 sm:h-40 md:h-48 w-auto group-hover:scale-105 transition-transform origin-left -my-4 sm:-my-12 md:-my-14"
            />
          </a>
          
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => scrollToSection("revenue-os-section")}
              className="text-muted-foreground hover:text-white transition-colors text-sm"
              data-testid="nav-platform"
            >
              Platform
            </button>
            <button 
              onClick={() => scrollToSection("timeline-section")}
              className="text-muted-foreground hover:text-white transition-colors text-sm"
              data-testid="nav-how-it-works"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection("stealth-section")}
              className="text-muted-foreground hover:text-white transition-colors text-sm"
              data-testid="nav-stealth"
            >
              STEALTH™
            </button>
            <button 
              onClick={() => scrollToSection("revenue-simulator-section")}
              className="text-muted-foreground hover:text-white transition-colors text-sm"
              data-testid="nav-simulator"
            >
              Simulator
            </button>
          </nav>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
              data-testid="button-mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/10">
          <nav className="flex flex-col p-4 space-y-3">
            <button 
              onClick={() => scrollToSection("revenue-os-section")}
              className="text-left text-muted-foreground hover:text-white transition-colors py-2"
            >
              Platform
            </button>
            <button 
              onClick={() => scrollToSection("timeline-section")}
              className="text-left text-muted-foreground hover:text-white transition-colors py-2"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection("stealth-section")}
              className="text-left text-muted-foreground hover:text-white transition-colors py-2"
            >
              STEALTH™
            </button>
            <button 
              onClick={() => scrollToSection("revenue-simulator-section")}
              className="text-left text-muted-foreground hover:text-white transition-colors py-2"
            >
              Simulator
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
