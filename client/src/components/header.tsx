import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import SanMathewsLogo from "@/components/san-mathews-logo";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", highlight: true },
    { href: "/", label: "Início" },
    { href: "/services", label: "Serviços" },
    { href: "/specialties", label: "Especialidades" },
    { href: "/doctors", label: "Médicos" },
    { href: "/testimonials", label: "Depoimentos" },
    { href: "/contact", label: "Contato" },
    { href: "/booking", label: "Agendamento", cta: true },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/attached_assets/Captura de tela 2025-06-19 130533_1750545678237.png" 
              alt="San Mathews Clínica e Laboratório" 
              className="h-12 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
          
          <div className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-medium ${
                  isActive(item.href)
                    ? item.highlight 
                      ? "text-white bg-blue-600 px-4 py-2 rounded-lg font-bold"
                      : item.cta
                        ? "text-white bg-green-600 px-4 py-2 rounded-lg font-bold"
                        : "text-blue-600 dark:text-blue-400"
                    : item.highlight
                      ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      : item.cta
                        ? "text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
                        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">55(85)99408-6263</span>
            </div>
            <ThemeToggle />
            <Link href="/login">
              <Button 
                variant="outline"
                className="hidden lg:inline-flex border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? item.highlight 
                            ? "text-white bg-blue-600 px-4 py-3 rounded-lg font-bold"
                            : "text-blue-600 dark:text-blue-400"
                          : item.highlight
                            ? "text-blue-600 bg-blue-50 px-4 py-3 rounded-lg font-bold hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Login do Sistema
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">55(85)99408-6263</span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
