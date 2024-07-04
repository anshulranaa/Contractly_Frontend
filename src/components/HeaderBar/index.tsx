import React, { useState } from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { Layout, Space, Typography, message, Input } from 'antd';
import { ethers } from 'ethers';
import styles from './index.module.less';

const { Link } = Typography;
const { Header } = Layout;
const { Search } = Input;

const HeaderBar = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [deploying, setDeploying] = useState<boolean>(false); // State for deployment status
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');



  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        setSigner(signer);
        return signer;
        message.success(`Connected: ${accountAddress}`);
      } catch (error) {
        console.error(error);
        message.error('Failed to connect to MetaMask');
      }
    } else {
      message.error('MetaMask is not installed');
    }
  };

  const deployContract = async () => {
    const signer = await connectToMetaMask();
    if (!signer || !account) {
      message.error('Signer or account is not available');
      return;
    }
    try {
      setDeploying(true);

      const signature = await signer.signMessage('Deploying contract');

      const response = await fetch('https://contractly-backend.onrender.com/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerAddress: account,
          signature: signature,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(`Deployment successful. Contract address: ${data.address}`);
      } else {
        const errorData = await response.json();
        message.error(`Deployment failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deploying:', error);
      message.error('Deployment failed');
    } finally {
      setDeploying(false);
    }
  };

  const handlePrivateKeyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKeyInput(event.target.value.trim());
  };

  const handlePrivateKeySubmission = async () => {
    const privateKey = prompt('Enter your private key..');
    
    try {
      if (!privateKey) {
        alert('Private key cannot be empty');
        return;
      }

      const response = await fetch('https://contractly-backend.onrender.com/api/store-private-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privateKey }),
      });

      if (response.ok) {
        alert('Private key stored successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to store private key: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error storing private key:', error);
      alert('Failed to store private key');
    }
  };


  return (
    <>
      <Header className={styles.header}>
        <div className={styles.logoBar}>
          <Link href="/">
            <h1>Contractly </h1>
          </Link>
        </div>
        <Space className={styles.right} size={0}>
          <span className={styles.right}>
            <Link className={styles.action} onClick={deployContract}>
              Deploy
            </Link>
            <Link>
              <Search
              className={styles.input}
              placeholder="Enter Private Key"
              allowClear
              enterButton="Submit"
              size="small"
              onSearch={handlePrivateKeySubmission}
              onChange={handlePrivateKeyInputChange}
              value={privateKeyInput}
              style = {{"position" : "absolute", "top" : "12px","right" : "150px", "width" : "500px"}}
            />
            </Link>
            <Link
              className={styles.action}
              href="https://github.com/anshulranaa"
              target="_blank"
            >
              <GithubOutlined />
            </Link>

          </span>
        </Space>
      </Header>
      <div className={styles.vacancy} />
    </>
  );
};

export default HeaderBar;
