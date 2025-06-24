import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Specialties from "@/pages/specialties";
import Doctors from "@/pages/doctors";
import ProfessionalProfile from "@/pages/professional-profile";
import Testimonials from "@/pages/testimonials";
import Contact from "@/pages/contact";
import Booking from "@/pages/booking";
import Dashboard from "@/pages/dashboard";
import RulerDemo from "@/pages/ruler-demo";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/specialties" component={Specialties} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/professional/:id" component={ProfessionalProfile} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/contact" component={Contact} />
      <Route path="/booking" component={Booking} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ruler" component={RulerDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="san-mathews-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            <Route path="/login">
              <div className="min-h-screen bg-background text-foreground">
                <Login />
              </div>
            </Route>
            <Route>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;