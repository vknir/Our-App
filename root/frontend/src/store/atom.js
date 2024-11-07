import { atom } from "recoil";

export const loadingState= atom({
    key:'loading',
    default:false
})

export const loginState = atom({
    key:'loginState',
    default:false,
})


export const lengthState= atom({
    key:'length',
    default: true,
})
