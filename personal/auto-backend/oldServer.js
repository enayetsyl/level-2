const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;

app.post('/clone-and-install', (req, res) => {
  const repoUrl = 'https://github.com/enayetsyl/autoshort-frontend.git';
  let folderName = req.body.projectName || 'new-project-1';
  folderName = folderName.replace(/\s+/g, '_'); // Replace spaces with underscores

  const cloneCommand = `git clone ${repoUrl} ${folderName}`;
  const installCommand = `cd ${folderName} && npm install --registry https://registry.npmjs.org/`;
  const deployCommand = `cd ${folderName} && vercel --prod --confirm`;

  exec(cloneCommand, (cloneError, cloneStdout, cloneStderr) => {
    if (cloneError) {
      console.error(`Error cloning repository: ${cloneError.message}`);
      return res.status(500).send(`Error cloning repository: ${cloneError.message}`);
    }
    if (cloneStderr) {
      console.error(`Stderr cloning repository: ${cloneStderr}`);
    }
    console.log(`Stdout cloning repository: ${cloneStdout}`);

    exec(installCommand, (installError, installStdout, installStderr) => {
      if (installError) {
        console.error(`Error installing dependencies: ${installError.message}`);
        return res.status(500).send(`Error installing dependencies: ${installError.message}`);
      }
      if (installStderr) {
        console.error(`Stderr installing dependencies: ${installStderr}`);
      }
      console.log(`Stdout installing dependencies: ${installStdout}`);

      exec(deployCommand, (deployError, deployStdout, deployStderr) => {
        if (deployError) {
          console.error(`Error deploying to Vercel: ${deployError.message}`);
          return res.status(500).send(`Error deploying to Vercel: ${deployError.message}`);
        }
        if (deployStderr) {
          console.error(`Stderr deploying to Vercel: ${deployStderr}`);
        }
        console.log(`Stdout deploying to Vercel: ${deployStdout}`);

        // Extract the Vercel deployment URL from stdout
        const vercelUrlMatch = deployStdout.match(/https:\/\/[^\s]+\.vercel\.app/);
        const vercelUrl = vercelUrlMatch ? vercelUrlMatch[0] : null;

        if (vercelUrl) {
          console.log(`Deployment URL: ${vercelUrl}`);
          res.send(`Repository cloned, dependencies installed, and project deployed to Vercel successfully. Deployment URL: ${vercelUrl}`);
        } else {
          console.error('Failed to extract Vercel deployment URL from output.');
          res.status(500).send('Deployment succeeded, but failed to extract Vercel deployment URL.');
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
