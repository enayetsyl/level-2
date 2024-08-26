const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;

app.post('/clone-and-install', (req, res) => {
  const repoUrl = 'https://github.com/enayetsyl/auto-website-fe-base.git';
  let folderName = req.body.projectName || 'new-project-1';
  folderName = folderName.replace(/\s+/g, '_'); // Replace spaces with underscores

  const {
    primaryColor,
    secondaryColor,
    backgroundColor,
    headerColor,
    buttonColor,
    textColor,
    logoImage,
    heroImage,
    heroHeading,
    heroText,
    aboutUsImage,
    aboutUsText1,
    aboutUsText2,
    feature1Heading,
    feature1Description,
    feature2Heading,
    feature2Description,
    feature3Heading,
    feature3Description,
    customer1Name,
    customer1Feedback,
    customer2Name,
    customer2Feedback,
    customer3Name,
    customer3Feedback,
    facebookLink,
    twitterLink,
    linkedinLink,
    companyName
  } = req.body;

  console.log("Received inputs:", req.body);

  const cloneCommand = `git clone ${repoUrl} ${folderName}`;
  const installCommand = `cd ${folderName} && npm install --registry https://registry.npmjs.org/`;
  const deployCommand = `cd ${folderName} && vercel --prod --yes`;

  exec(cloneCommand, (cloneError, cloneStdout, cloneStderr) => {
    if (cloneError) {
      console.error(`Error cloning repository: ${cloneError.message}`);
      return res.status(500).send(`Error cloning repository: ${cloneError.message}`);
    }
    console.log(`Repository cloned successfully: ${cloneStdout}`);

    // Update the Tailwind CSS config with the new colors
    const tailwindConfigPath = path.join(__dirname, folderName, 'tailwind.config.js');
    fs.readFile(tailwindConfigPath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(`Error reading Tailwind config: ${readErr.message}`);
        return res.status(500).send(`Error reading Tailwind config: ${readErr.message}`);
      }

      const updatedConfig = data
        .replace(/primary:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `primary: '${primaryColor}'`)
        .replace(/secondary:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `secondary: '${secondaryColor}'`)
        .replace(/backgroundColor:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `backgroundColor: '${backgroundColor}'`)
        .replace(/headerColor:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `headerColor: '${headerColor}'`)
        .replace(/button:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `button: '${buttonColor}'`)
        .replace(/textColor:\s*['"`]#[0-9A-Fa-f]{6}['"`]/, `textColor: '${textColor}'`);

      fs.writeFile(tailwindConfigPath, updatedConfig, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(`Error updating Tailwind config: ${writeErr.message}`);
          return res.status(500).send(`Error updating Tailwind config: ${writeErr.message}`);
        }
        console.log("Tailwind config updated successfully with new colors.");

        // Update the files with the new content
            const footerJsxPath = path.join(__dirname, folderName, 'src', 'component', 'Footer.jsx');
        const navbarJsxPath = path.join(__dirname, folderName, 'src', 'component', 'Navbar.jsx');
        const heroJsxPath = path.join(__dirname, folderName, 'src', 'component', 'Hero.jsx');
        const aboutUsJsxPath = path.join(__dirname, folderName, 'src', 'component', 'AboutUs.jsx');
        const featuresJsxPath = path.join(__dirname, folderName, 'src', 'component', 'Features.jsx');
        const testimonialsJsxPath = path.join(__dirname, folderName, 'src', 'component', 'Testimonials.jsx');

        // Modify the respective files with the user-provided content
      
        modifyFile(heroJsxPath, {
          heroImage, heroHeading, heroText
        });
        modifyFile(aboutUsJsxPath, {
          aboutUsImage, aboutUsText1, aboutUsText2
        });
        modifyFile(featuresJsxPath, {
          feature1Heading, feature1Description, feature2Heading, feature2Description, feature3Heading, feature3Description
        });
        modifyFile(testimonialsJsxPath, {
          customer1Name, customer1Feedback, customer2Name, customer2Feedback, customer3Name, customer3Feedback
        });
        modifyFile(footerJsxPath, {
          facebookLink, twitterLink, linkedinLink, companyName
        });
        modifyFile(navbarJsxPath, {
          logoImage
        });

        // Proceed with installation and deployment
        exec(installCommand, (installError, installStdout, installStderr) => {
          if (installError) {
            console.error(`Error installing dependencies: ${installError.message}`);
            return res.status(500).send(`Error installing dependencies: ${installError.message}`);
          }
          console.log(`Dependencies installed successfully: ${installStdout}`);

          exec(deployCommand, (deployError, deployStdout, deployStderr) => {
            if (deployError) {
              console.error(`Error deploying to Vercel: ${deployError.message}`);
              return res.status(500).send(`Error deploying to Vercel: ${deployError.message}`);
            }
            console.log(`Deployment successful: ${deployStdout}`);

            // Extract the Vercel deployment URL from stdout
            const vercelUrlMatch = deployStdout.match(/https:\/\/[^\s]+\.vercel\.app/);
            const vercelUrl = vercelUrlMatch ? vercelUrlMatch[0] : null;

            if (vercelUrl) {
              console.log(`Deployment URL: ${vercelUrl}`);
              // res.send(vercelUrl);
              res.send(`Repository cloned, dependencies installed, and project deployed to Vercel successfully. Deployment URL: ${vercelUrl}`);
            } else {
              console.error('Failed to extract Vercel deployment URL from output.');
              res.status(500).send('Deployment succeeded, but failed to extract Vercel deployment URL.');
            }
          });
        });
      });
    });
  });
});

function modifyFile(filePath, replacements) {
  console.log(`Modifying file: ${filePath}`);
  fs.readFile(filePath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error(`Error reading file ${filePath}: ${readErr.message}`);
      return;
    }

    let modifiedData = data;

    // Replace specific strings in the file content based on the file type
    if (filePath.includes('Hero.jsx')) {
      modifiedData = modifiedData.replace(/Welcome to Our Adventure/, replacements.heroHeading)
                                 .replace(/Explore the world with us, where every journey begins with a single step./, replacements.heroText)
                                 .replace(/https:\/\/media\.istockphoto\.com\/id\/517188688\/photo\/mountain-landscape\.jpg\?s=1024x1024&w=0&k=20&c=z8_rWaI8x4zApNEEG9DnWlGXyDIXe-OmsAyQ5fGPVV8=/, replacements.heroImage);
    } else if (filePath.includes('AboutUs.jsx')) {
      modifiedData = modifiedData.replace(/Learn more about our journey, our mission, and the values that drive us./, replacements.aboutUsText1)
                                 .replace(/We believe in delivering the best experiences for our customers by focusing on quality, innovation, and integrity./, replacements.aboutUsText2)
                                 .replace(/https:\/\/media\.istockphoto\.com\/id\/517188688\/photo\/mountain-landscape\.jpg\?s=1024x1024&w=0&k=20&c=z8_rWaI8x4zApNEEG9DnWlGXyDIXe-OmsAyQ5fGPVV8=/, replacements.aboutUsImage);
    } else if (filePath.includes('Features.jsx')) {
      modifiedData = modifiedData.replace(/Feature 1/, replacements.feature1Heading)
                                 .replace(/Feature 2/, replacements.feature2Heading)
                                 .replace(/Feature 3/, replacements.feature3Heading)
                                 .replace(/Description of Feature 1./, replacements.feature1Description)
                                 .replace(/Description of Feature 2./, replacements.feature2Description)
                                 .replace(/Description of Feature 3./, replacements.feature3Description);
    } else if (filePath.includes('Footer.jsx')) {
      modifiedData = modifiedData.replace(/YourCompany/, replacements.companyName)
                                 .replace(/https:\/\/www.facebook.com\/profile.php\?id=100094416483981/, replacements.facebookLink)
                                 .replace(/https:\/\/x.com\/enayetu_syl/, replacements.twitterLink)
                                 .replace(/https:\/\/www.linkedin.com\/in\/md-enayetur-rahman\//, replacements.linkedinLink);
    } else if (filePath.includes('Navbar.jsx')) {
      modifiedData = modifiedData.replace(
        /https:\/\/cc-prod\.scene7\.com\/is\/image\/CCProdAuthor\/mascot-logo-design_P1_900x420\?\$pjpeg\$&jpegSize=200&wid=900/g,
        replacements.logoImage
      );
    } else if (filePath.includes('Testimonials.jsx')) {
      modifiedData = modifiedData.replace(/- Customer 1/g, `- ${replacements.customer1Name}`)
      .replace(/"This service was amazing! I couldn’t have asked for more."/g, `"${replacements.customer1Feedback}"`)
      .replace(/- Customer 2/g, `- ${replacements.customer2Name}`)
      .replace(/"Highly recommend to anyone looking for great quality."/g, `"${replacements.customer2Feedback}"`)
      .replace(/- Customer 3/g, `- ${replacements.customer3Name}`)
      .replace(/"Exceptional experience from start to finish!"/g, `"${replacements.customer3Feedback}"`);
    }
    

    fs.writeFile(filePath, modifiedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing file ${filePath}: ${writeErr.message}`);
      } else {
        console.log(`File ${filePath} modified successfully.`);
      }
    });
  });
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
