import { atom } from "recoil";

const loadingState= atom({
    key:'loading',
    default:false
})

export default loadingState