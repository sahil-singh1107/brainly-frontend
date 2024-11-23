import { useRecoilState } from "recoil"
import { tokenAtom } from "@/store/atoms/atoms"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"

const DashBoard = () => {
  const navigate = useNavigate()
  const [token, setToken] = useRecoilState(tokenAtom)

  useEffect(() => {
    let item = localStorage.getItem("token")
    if (item) {
      setToken(item)
    }
    else {
      navigate("/signin")
    }
  }, [])
  
  return (
    <div className="text-white bg-black h-screen flex">
      <div className="w-1/4 h-screen flex flex-col justify-between border-r-[0.2px] border-white">
       <Sidebar/>
      </div>
      <div className="w-3/4 h-screen ml-10">
      <Navbar/>
      </div>
      
    </div>
  )
}

export default DashBoard  