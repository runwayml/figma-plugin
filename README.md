# Steps to install and use the Runway plugin

1. Install the [Figma Desktop App](https://www.figma.com/downloads/) if you haven't already.
2. Clone or download this repository, and save it in a folder of your choice.
3. From the Figma Desktop App, navigate to **Plugins > Development > Import plugin from manifest** and choose the `manifest.json` file from your downloaded folder.
4. Run the plugin by selecting **Plugins > Development > Runway**.

## Setting up a hosted page

5. To run the plugin, you need to host `ui.html` as a website. You can host this on [Github pages](https://pages.github.com/) or any service that you prefer. Update the placeholder link in line 17 of `code.ts` with the link for your hosted `ui.html` file.

   5.1 Open `manifest.json` and add your domain name to `allowedDomains`.

## Setting up an allowlisted proxy

> [!WARNING]
> The Runway API only allows server-side calls to protect users from API key exposure. This tutorial suggests using a 3rd-party service as a proxy between the plugin and the API, but we have no affiliation with this service. For production use, we **strongly** recommend implementing your own proxy server solution rather than relying on third-party services.

6. Go to https://corsfix.com and sign up for an account. Create an application and add your domain (eg. https://runwayml.github.io) and https://figma.com to `Allowed Origins`. You can choose to keep A`ll domains` for `Allowed domains`, or choose to add https://api.dev.runwayml.com as an allowed custom domain.

Note: Corsfix only allows up to 5mb payloads.

## Setting up your Runway API account

7. Visit https://dev.runwayml.com/ and sign up for an account (or log in if you already have one). Navigate to **API Keys** and create an API key.

> [!IMPORTANT]
> Keep your API key secure and never share it publicly. This key provides access to your account and resources.

## Running the plugin

8. Enter the key in the plugin, and hit **save**. Now you can either type in a prompt to Generate an image, or select frames to generate images with references, or generate videos!

### Development setup

This plugin template uses Typescript and NPM, two standard tools for creating JavaScript applications.

First, download [Node.js](https://nodejs.org/en/download), which comes with NPM. This will allow you to install TypeScript and other
libraries.

Next, install TypeScript:

`npm install -g typescript`

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors, such as Visual Studio Code,
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (`code.ts`) into JavaScript (`code.js`)
for the browser to run.

Install the package dependencies by running the command:

`npm install`

Run the `watch` script to continuously compile typescript:

`npm run watch`
