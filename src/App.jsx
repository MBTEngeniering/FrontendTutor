import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ChatSupport from "./components/ChatSupport.jsx";
import Restricted from "./pages/Restricted.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

// Seitenkomponenten importieren
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const Abikurs = lazy(() => import("./pages/Abikurs.jsx"));
const Beratung = lazy(() => import("./pages/Beratung.jsx"));
const RegisterStudent = lazy(() => import("./pages/Student/RegisterStudent.jsx"));
const Konzept = lazy(() => import("./pages/Konzept.jsx"));
const RegisterTutor = lazy(() => import("./pages/Tutor/RegisterTutor.jsx"));
const Prices = lazy(() => import("./pages/Prices.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const Tutor = lazy(() => import("./pages/Tutor/TutorSeite.jsx"));
const Schueler = lazy(() => import("./pages/Student/SchuelerSeite.jsx"));
const Tutors = lazy(() => import("./pages/Tutor/Tutors.jsx"));
const Admin = lazy(() => import("./pages/Admin/AdminSeite.jsx"));
const Enterprise = lazy(() => import("./pages/EnterpriseSeite.jsx"));
const Support = lazy(() => import("./pages/Support/SupportSeite.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const Finance = lazy(() => import("./pages/Billing/FinanceSeite.jsx"));
const Footer = lazy(() => import(":comp/Footer.jsx"));
const Impressum = lazy(() => import("./pages/FooterPages/Impressum.jsx"));
const Datenschutz = lazy(() => import("./pages/FooterPages/Datenschutz.jsx"));
const Agb = lazy(() => import("./pages/FooterPages/Agb.jsx"));
const Faq = lazy(() => import("./pages/FooterPages/Faq.jsx"));
const Hilfe = lazy(() => import("./pages/FooterPages/Hilfe.jsx"));
const Blog = lazy(() => import("./pages/FooterPages/Blog.jsx"));
const Notfound = lazy(() => import("./pages/Notfound.jsx"));
const Vortraege = lazy(() => import("./pages/Vortraege.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Manage = lazy(() => import("./pages/ManageSeite.jsx"));
const LoadingScreen = lazy(() => import("./components/LoadingScreen.jsx"));
const WhoWeAre = lazy(() => import("./pages/WhoWeAre.jsx"));
const Kontakt = lazy(() => import("./pages/Kontakt.jsx"));
const CorporateIdentity = lazy(() => import("./pages/CorporateIdentity.jsx"));
const Header = lazy(() => import("./components/Header.jsx"));
const Authenticate = lazy(() => import("./pages/Authenticate.jsx"));

const App = () => {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen/>}>
            <Header/>
            <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/registrierung" element={<Register/>}/>
              <Route path="/abikurs" element={<Abikurs/>}/>
              <Route path="/beratung" element={<Beratung/>}/>
              <Route path="/ueberuns" element={<AboutUs/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/preise" element={<Prices/>}/>
              <Route path="/elternschueler" element={<RegisterStudent/>}/>
              <Route path="/lehrer" element={<RegisterTutor/>}/>
              <Route path="/konzept" element={<Konzept/>}/>
              <Route path="/schueler" element={<Schueler/>}/>
              <Route path="/tutor" element={<Tutor/>}/>
              <Route path="/vortraege" element={<Vortraege/>}/>
              <Route path="/tutors" element={<Tutors/>}/>
              <Route path="/enterprise" element={<Enterprise/>}/>
              <Route path="/manage" element={<Manage/>}/>
              <Route path="/support" element={<Support/>}/>
              <Route path="/admin" element={<ProtectedRoute roles={[5]} element={<Admin/>}/>}/>

              <Route path="/finance" element={<ProtectedRoute roles={[4]} element={<Finance/>}/>}/>
              <Route path="/passwort-vergessen" element={<PasswordReset/>}/>
              <Route path="/impressum" element={<Impressum/>}/>
              <Route path="/datenschutz" element={<Datenschutz/>}/>
              <Route path="/agb" element={<Agb/>}/>
              <Route path="/faq" element={<Faq/>}/>
              <Route path="/hilfe" element={<Hilfe/>}/>
              <Route path="/blog" element={<Blog/>}/>
              <Route path="/wer-sind-wir" element={<WhoWeAre/>}/>
              <Route path="/kontakt" element={<Kontakt/>}/>
              <Route path="/authenticate" element={<Authenticate/>}/>
              <Route path="/ci" element={<CorporateIdentity/>}/>
              <Route path="/rest" element={<Restricted/>}/>
              {/* Immer zuletzt */}
              <Route path="*" element={<Notfound/>}/>
            </Routes>
            <Footer/>
            <ChatSupport/>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
