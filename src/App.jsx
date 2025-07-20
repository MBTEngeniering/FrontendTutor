import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ChatSupport from "./components/ChatSupport.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ADMIN, FINANCE } from "./util/mapping.js";

// Seitenkomponenten importieren
const Homepage = lazy(() => import("./pages/Menu/Homepage.jsx"));
const Abikurs = lazy(() => import("./pages/Menu/Abikurs.jsx"));
const Beratung = lazy(() => import("./pages/Menu/Beratung.jsx"));
const RegisterStudent = lazy(() => import("./pages/Student/RegisterStudent.jsx"));
const Konzept = lazy(() => import("./pages/Menu/Konzept.jsx"));
const RegisterTutor = lazy(() => import("./pages/Tutor/RegisterTutor.jsx"));
const Prices = lazy(() => import("./pages/Menu/Prices.jsx"));
const Login = lazy(() => import("./pages/Menu/Login.jsx"));
const AboutUs = lazy(() => import("./pages/Menu/AboutUs.jsx"));
const Tutor = lazy(() => import("./pages/Tutor/TutorSeite.jsx"));
const Schueler = lazy(() => import("./pages/Student/SchuelerSeite.jsx"));
const Tutors = lazy(() => import("./pages/Tutor/Tutors.jsx"));
const Admin = lazy(() => import("./pages/Admin/AdminSeite.jsx"));
const Enterprise = lazy(() => import("./pages/common/EnterpriseSeite.jsx"));
const Support = lazy(() => import("./pages/Support/SupportSeite.jsx"));
const PasswordReset = lazy(() => import("./pages/common/PasswordReset.jsx"));
const Finance = lazy(() => import("./pages/Billing/FinanceSeite.jsx"));
const Footer = lazy(() => import(":common/Footer.jsx"));
const Impressum = lazy(() => import("./pages/FooterPages/Impressum.jsx"));
const Datenschutz = lazy(() => import("./pages/FooterPages/Datenschutz.jsx"));
const Agb = lazy(() => import("./pages/FooterPages/Agb.jsx"));
const Faq = lazy(() => import("./pages/FooterPages/Faq.jsx"));
const Hilfe = lazy(() => import("./pages/FooterPages/Hilfe.jsx"));
const Blog = lazy(() => import("./pages/FooterPages/Blog.jsx"));
const Notfound = lazy(() => import("./pages/common/Notfound.jsx"));
const Vortraege = lazy(() => import("./pages/Menu/Vortraege.jsx"));
const Register = lazy(() => import("./pages/Menu/Register.jsx"));
const Manage = lazy(() => import("./pages/common/ManageSeite.jsx"));
const LoadingScreen = lazy(() => import("./pages/common/LoadingScreen.jsx"));
const WhoWeAre = lazy(() => import("./pages/Menu/WhoWeAre.jsx"));
const Kontakt = lazy(() => import("./pages/Menu/Kontakt.jsx"));
const CorporateIdentity = lazy(() => import("./pages/common/CorporateIdentity.jsx"));
const Header = lazy(() => import("./pages/common/Header.jsx"));
const Authenticate = lazy(() => import("./pages/Menu/Login.jsx"));

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
              <Route path="/admin" element={<ProtectedRoute roles={[ADMIN]} element={<Admin/>}/>}/>

              <Route path="/finance" element={<ProtectedRoute roles={[FINANCE]} element={<Finance/>}/>}/>
              <Route path="/passwort-vergessen" element={<PasswordReset/>}/>
              <Route path="/impressum" element={<Impressum/>}/>
              <Route path="/datenschutz" element={<Datenschutz/>}/>
              <Route path="/agb" element={<Agb/>}/>
              <Route path="/faq" element={<Faq/>}/>
              <Route path="/hilfe" element={<Hilfe/>}/>
              <Route path="/blog" element={<Blog/>}/>
              <Route path="/wer-sind-wir" element={<WhoWeAre/>}/>
              <Route path="/kontakt" element={<Kontakt/>}/>

              <Route path="/ci" element={<CorporateIdentity/>}/>

              {/* Always last! */}
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
