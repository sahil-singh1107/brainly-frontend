// @ts-nocheck
import { useRecoilState } from "recoil"
import { linkAtom, tokenAtom } from "@/store/atoms/atoms"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import SidebarComponent from "@/components/Sidebar"
import axios from "axios"

const DashBoard = () => {
  const navigate = useNavigate()
  const [token, setToken] = useRecoilState(tokenAtom)
  const [shareableLink, setShareableLink] = useRecoilState(linkAtom)

  useEffect(() => {
    let item = localStorage.getItem("token")
    if (item) {
      setToken(item)
    }
    else {
      navigate("/signin")
    }
  }, [])

  console.log(shareableLink)

  return (
    <div className="text-white bg-black h-screen flex">
      <div className="w-1/4 h-screen flex flex-col justify-between border-r-[0.1px] border-[#26262A]">
        <SidebarComponent />
      </div>
      <div className="w-3/4 h-screen ml-10">
        <Navbar />
      </div>

    </div>
  )
}

export default DashBoard  