require('dotenv').config();
const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function deploy() {
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
        const localDir = process.env.FTP_LOCAL_DIR || '.';
        const remoteDir = process.env.FTP_PATH || '/';
        console.log(`Uploading ${localDir} to ${remoteDir} ...`);
        await client.ensureDir(remoteDir);
        // Do NOT clear remote directory

        // Upload all files except images/paintings/
        const excludeImages = (src) => {
            // Skip anything in images/paintings/
            const rel = path.relative(localDir, src);
            return !rel.startsWith('images/paintings');
        };

        // Recursively upload files except excluded ones
        async function uploadDir(dir, remote) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const localPath = path.join(dir, entry.name);
                const remotePath = remote + '/' + entry.name;
                if (!excludeImages(localPath)) continue;
                if (entry.isDirectory()) {
                    await client.ensureDir(remotePath);
                    await uploadDir(localPath, remotePath);
                } else {
                    await client.uploadFrom(localPath, remotePath);
                }
            }
        }

        await uploadDir(localDir, remoteDir);
        console.log('Deployment complete!');
    } catch (err) {
        console.error('FTP deployment failed:', err);
    }
    client.close();
}

deploy();
