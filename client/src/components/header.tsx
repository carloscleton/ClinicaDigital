import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import SanMathewsLogo from "@/components/san-mathews-logo";
import NotificationSystem from "@/components/notification-system";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/services", label: "Serviços" },
    { href: "/specialties", label: "Especialidades" },
    { href: "/doctors", label: "Profissionais" },
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
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <nav className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity mr-2 sm:mr-8">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs sm:text-sm">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  San Mathews
                </span>
                <span className="text-xs text-green-600 dark:text-green-400 leading-tight hidden xs:block">
                  Clínica e Laboratório
                </span>
              </div>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? item.cta
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : item.cta
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden xl:flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">(85) 99408-6263</span>
            </div>
            {location === "/dashboard" && <NotificationSystem />}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link href="/dashboard">
              <Button 
                variant="outline"
                className="hidden md:inline-flex border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500 shadow-sm"
                size="sm"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline"
                className="hidden md:inline-flex border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500 shadow-sm"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Button>
            </Link>

            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-white dark:bg-gray-900">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3 py-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">
                        San Mathews
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 leading-tight whitespace-nowrap">
                        Clínica e Laboratório
                      </span>
                    </div>
                  </div>
                  
                  <nav className="flex flex-col space-y-2 py-6 flex-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        Dashboard
                      </div>
                    </Link>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? item.cta
                              ? "bg-green-600 text-white shadow-sm"
                              : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : item.cta
                              ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
                      <ThemeToggle />
                    </div>
                    
                    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">(85) 99408-6263</span>
                    </div>
                    
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 shadow-sm"
                        size="lg"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Login do Sistema
                      </Button>
                    </Link>
                    
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">(85) 99408-6263</span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}