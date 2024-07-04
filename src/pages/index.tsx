import React from 'react'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import ChatGPT from '@/components/ChatGPT'
import FooterBar from '@/components/FooterBar'
import HeaderBar from '@/components/HeaderBar'
import styles from './index.module.less'

export default function Home() {
  return (
    <Layout hasSider className={styles.layout}>
      <Layout>
        <HeaderBar />
        <Content className={styles.main}>
          <ChatGPT fetchPath="/api/chat-completion" />
        </Content>
        <FooterBar />
      </Layout>
    </Layout>
  )
}