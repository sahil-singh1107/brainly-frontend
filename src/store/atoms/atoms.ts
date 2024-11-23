import {atom} from "recoil"

export const tokenAtom = atom({
    key: "token",
    default: ""
})

export const tagsAtom = atom({
    key: "tag",
    default: []
})