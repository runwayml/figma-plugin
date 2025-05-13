# Steps to install and use the Runway plugin

1. Install the Figma Desktop App if you haven't already.
2. Clone or download this repository, and save it in a folder of your choice.
3. Go to Plugins > Development > Import plugin from manifest and pick the manifest.json file in the folder that you have just downloaded.
4. Run the plugin by going to Plugins > Development > Runway

## Setting up a hosted page

5. To run the plugin, you need to host ui.html on a website somewhere. You can do so with [Github pages](https://pages.github.com/) or any service that you prefer. Once uploaded, grab the link eg. (https://runwayml.github.io/figma-plugin/ui.html) and replace it in line 17 of code.ts.

5.1. Go to manifest.json and add your domain name to allowedDomains.

## Setting up an allowlisted proxy

Disclaimer: The Runway API only allows server-side calls to protect API users by avoiding the potential of API keys leaking. This tutorial recommends a 3rd party service that we have no affiliation with to serve as the proxy between the plugin, and the Runway API. You can, and should implement this proxy on your own if you are to implement this plugin for your own need.

6. Go to https://corsfix.com and sign up for an account. Create an application and add your domain (eg. https://runwayml.github.io) and https://figma.com to Allowed Origins. You can choose to keep All domains for "Allowed domains", or choose to add https://api.dev.runwayml.com as an allowed custom domain.

## Setting up your Runway API account

7. Go to https://dev.runwayml.com/ and sign up for an account if you haven't already. Then, go to API Keys, and create your own API key. DO NOT share this key with anyone!

## Running the plugin

8. Enter the key in the plugin, and hit save. Now you can either type in a prompt to Generate an image, or select frames to generate images with references, or generate videos!

### Development setup

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

https://nodejs.org/en/download/

Next, install TypeScript using the command:

npm install -g typescript

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

Install the package dependencies by running the command:

npm install

Run the watch script to continuously compile typescript:

npm run watch
