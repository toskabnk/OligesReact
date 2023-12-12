<p align="center"><a href='https://postimg.cc/dkm3tsZP' target='_blank'><a href='https://postimages.org/' target='_blank'><img src='https://i.postimg.cc/RFmrHLtV/oliges-logo-1.png' border='0' alt='oliges-logo-1' width=300/></a></p>
<img src='https://badgen.net/github/release/toskabnk/OligesAPI'/>
<img src='https://badgen.net/github/tag/toskabnk/OligesAPI'/>
<img src='https://badgen.net/github/open-issues/toskabnk/OligesAPI'/>
<img src='https://badgen.net/github/last-commit/toskabnk/OligesAPI'/>
<img src='https://badgen.net/static/React/18.2.0'/>

## About Oliges

Oliges, an easy-to-use web application, is designed to streamline the management of olive oil cooperatives, covering everything from olive intake management to the automated generation of Delivery Note (DAT) documents. Oliges stands out for its ability to:

- Manage information about farmers and their properties.
- Record olive intake and generate receipts automatically.
- Handle lots sent to the mills.
- Simplify the creation of necessary documentation.
- Provide detailed statistics visualization.

With Oliges, you'll efficiently and swiftly digitize your cooperative.

## Requirements
In a local enviroment:
- NodeJS 20 and NPM
- We need to have the API from https://github.com/toskabnk/OligesAPI installed and configured

## Installation

Clone the repository into a folder with the project name:
```shell
git clone https://github.com/toskabnk/OligesReact.git
```
Or in the current folder with:
```shell
git clone https://github.com/toskabnk/OligesReact.git .
```

Install the dependencies with

```shell
npm install
```

Rename the file .env.example to .env and modify the value of `VITE_API_URL='http://localhost:3000'` with the API address. No need to add a license to `VITE_MUI_LICENSE='MY_LINCENSE_KEY'`, but if you have one, add it there.

## Run

Once the dependencies are installed, you can run the project in a local environment by executing the following command in a terminal:

```shell
npm run dev
```

## Compilation

To compile the project, run the following command in a terminal
```shell
npm run build
```
A 'dist' folder will be created in the root of the project. Inside, you will find the assets used, as well as the compiled HTML and JS code of the project.