import { Linkedin, Twitter, Mail } from "lucide-react";
import symmetriLogo from "@assets/newsymmlogo_1764585841560.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <a 
              href="#" 
              className="flex items-center mb-4 overflow-visible"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img 
                src={symmetriLogo} 
                alt="SymmetriLabs" 
                className="h-24 w-auto -my-6"
              />
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The autonomous Revenue Engine that unifies ABM and outbound into one living system. From chaos to Symmetri.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Revenue Engine
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Living Data Core
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Multi-Agent Platform
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  STEALTH™ Protocol
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-muted transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Symmetri Growth Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
