import store from "@/store"
import { eventBus } from "@/utils/event-bus"

var userLoginBus = undefined

var loginTaskTimer = undefined

export function beginEventBus() {
    if (!userLoginBus) {
        userLoginBus = eventBus.$on("user_login", onLogin)
    }
}

export function endEventBus() {
    if (userLoginBus) {
        eventBus.$off("user_login")
        userLoginBus = undefined
    }
    if (loginTaskTimer) {
        clearInterval(loginTaskTimer)
        loginTaskTimer = undefined
    }
}

function onLogin() {
    store.dispatch("GetBalanceOfBnb")
    store.dispatch("GetBalanceOfMbd")
    store.dispatch("UpdateCheckStatus")
}

function taskInit() {
    loginTaskTimer = setInterval(() => {
        store.dispatch("LoadMbdPrice")
        if (store.state.user.token) {
            store.dispatch("GetBalanceOfBnb")
            store.dispatch("GetBalanceOfMbd")
            store.dispatch("UpdateCheckStatus")
            console.log("Temporary data update")
        }
    }, 20000)
}

taskInit()
