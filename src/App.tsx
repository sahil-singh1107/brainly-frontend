import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import DashBoard from "./pages/DashBoard"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard/>}/>
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/signin" element={<LoginForm/>} />
        
      </Routes>
    </BrowserRouter>
  )
}
