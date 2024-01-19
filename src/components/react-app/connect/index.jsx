import store from '@/store'
import { isEVMProvider } from '@particle-network/connect'
import {
  ConnectButton,
  useAccountInfo,
  useConnectKit,
  useLanguage,
  useParticleTheme,
} from '@particle-network/connect-react-ui'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import './index.css'
console.log(React.version)

function WalletButton() {
  const connectKit = useConnectKit()
  const [loginProcess, setLoginProcess] = useState(false)
  const { changLanguage } = useLanguage()
  const accountInfo = useAccountInfo()

  /** 监听地址信息 */
  useEffect(() => {
    const { account, connectId, accountLoading } = accountInfo
    if (account && loginProcess && !accountLoading) {
      setLoginProcess(false)
      store.dispatch('Login', { address: account })
    }
    const particleOptions = [
      'email',
      'phone',
      'google',
      'apple',
      'facebook',
      'twitter',
      'github',
      'linkedin',
      'particle',
    ]
    if (particleOptions.includes(connectId)) {
      store.dispatch('UpdateIsParticleProvider', true)
    } else {
      store.dispatch('UpdateIsParticleProvider', false)
    }
  }, [accountInfo])

  /** 事件监听 */
  useEffect(() => {
    if (connectKit) {
      connectKit.on('connect', (provider) => {
        if (provider && isEVMProvider(provider)) {
          const web3 = new Web3(provider)
          window.web3Particle = web3
        }
      })
      connectKit.on('disconnect', () => {
        console.log('disconnect')
        sessionStorage.removeItem("web3Provider")
      })
      connectKit.on('chainChanged', (chain) => {
        console.log('chainChanged:', chain)
      })
      connectKit.on('accountsChanged', (accounts) => {
        if (accounts && accounts[0]) {
          store.commit('setChainAccount', accounts[0])
          store.dispatch('Login', { address: accounts[0] }).then(() => {
            setLoginProcess(false)
          })
        }
      })
    }
  }, [])

  /** 切换主题 */
  const { setTheme } = useParticleTheme()
  useEffect(() => {
    setTheme(store.state.common.theme)
  }, [store.state.common.theme])

  /** 外部组件按键退出 */
  useEffect(() => {
    if (store.state.user.logout) {
      store.commit('setLogout', false)
      connectKit.disconnect({ hideLoading: true })
    }
  }, [store.state.user.logout])

  /** 语言切换 */
  useEffect(() => {
    if (store.state.common.language == 'en') {
      changLanguage('en')
    } else {
      changLanguage('zh_TW')
    }
  }, [store.state.common.language])

  /** 打开Particle钱包 */
  useEffect(() => {
    if (
      store.state.common.isParticleProvider &&
      store.state.common.openAccount
    ) {
      connectKit.particle.openWallet()
      store.commit('setOpenAccount', false)
    }
  }, [store.state.common.openAccount])

  /** 打开Particle Buy页面 */
  useEffect(() => {
    if (store.state.common.isParticleProvider && store.state.common.openBuy) {
      connectKit.particle.openBuy()
      store.commit('setOpenBuy', false)
    }
  }, [store.state.common.openBuy])

  return (
    <div>
      <ConnectButton.Custom>
        {({ openConnectModal }) => {
          const handleOpenConnectModal = () => {
            connectKit.disconnect().then(() => {
              openConnectModal()
              setLoginProcess(true)
            })
          }

          useEffect(() => {
            if (store.state.common.openConnect) {
              handleOpenConnectModal()
              store.commit('setOpenConnect', false)
            }
          }, [store.state.common.openConnect])

          return (
            <div>
              <button
                className={'connect-button'}
                onClick={handleOpenConnectModal}
              >
                {store.state.common.language == 'en'
                  ? 'Connect Wallet'
                  : '連接錢包'}
              </button>
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}

export default WalletButton
