import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

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
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">San Mathews</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Clínica e Laboratório</p>
            </div>
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
                      : "text-blue-600 dark:text-blue-400"
                    : item.highlight
                      ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
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
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">55(85)99408-6263</span>
                    </div>
                    <ThemeToggle />
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
