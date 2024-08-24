import dotenv from "dotenv";
import { createTunnel } from "tunnel-ssh";

dotenv.config();
const sshHost = process.env.sshHost;
const sshUser = process.env.sshUser;
const sshPrivateKey = process.env.sshPrivateKey;

export async function createSSHTunnelToMySQLPort() {
  const PORT = 3306;
  const TUNNEL_OPTION = {
    autoClose: true,
  };
  const SERVER_ONTION = {
    port: PORT,
  };
  const SSH_OPTION = {
    username: sshUser,
    host: sshHost,
    port: "10022",
    privateKey: sshPrivateKey,
  };
  const FORWARD_OPTION = {
    srcAddr: "localhost",
    srcPort: PORT,
    dstAddr: "localhost",
    dstPort: PORT,
  };

  await createTunnel(TUNNEL_OPTION, SERVER_ONTION, SSH_OPTION, FORWARD_OPTION);
}