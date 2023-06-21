// app.ts
import { AES_Decrypt } from "./utils/crypto";
App({
    onLaunch() {
        const accessToken = AES_Decrypt((wx.getStorageSync<string>("access_token")));
        if (accessToken) {
            wx.reLaunch({ url: "/pages/list/list" });
        } else {
            wx.removeStorageSync("access_token");
        }
    },
})