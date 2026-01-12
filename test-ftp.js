require('dotenv').config();
const ftp = require('basic-ftp');

async function testFtpConnection() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
            secure: false,
            passive: process.env.FTP_PASSIVE === 'true',
        });
        console.log('Connected! Listing root directory:');
        console.log(await client.list(process.env.FTP_PATH || '/'));
    } catch (err) {
        console.error('FTP connection failed:', err);
    }
    client.close();
}

testFtpConnection();
