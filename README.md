<!-- MD033 ignore -->
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

# F1 // SP

Formula 1 Stats and Predictions

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

[![Azure Static Web Apps CI/CD](https://github.com/dah007/f1sp/actions/workflows/azure-static-web-apps-thankful-meadow-0f2e4ef10.yml/badge.svg)](https://github.com/dah007/f1sp/actions/workflows/azure-static-web-apps-thankful-meadow-0f2e4ef10.yml)
[![Vite][ViteJS-shield]][ViteJS-url] [![React][React.js]][React-url]
[![TypeScript][TypeScript-shield]][TypeScript-url]
[![React Router][React_Router-shield]][React_Router-url]
[![VS Code][VSCode-shield]][VSCode-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dah007/f1sp">
    <img src="src/assets/logos/f1_rank_just_car.png" alt="Logo" width="300">
  </a>

<h3 align="center">F1 // SP</h3>

  <p align="center">
    F1 Stats and Voting app for the awesome F1DB.
    <br />
    <a href="https://github.com/dah007/f1sp/docs/SETUP.md"><strong>Setup »</strong></a>
    <br />
    <a href="https://github.com/dah007/f1sp/docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dah007/f1sp">View Demo</a>
    ·
    <a href="https://github.com/dah007/f1sp/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/dah007/f1sp/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<p align="center">
  <img src="public/screenshot.png" width="400" alt="site screenshot" />
</p>

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `dah007`, `f1rank`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

1. Docker engine (Docker Desktop not required, but handy)
2. Free Mapbox API key: [https://mapbox.com](https://mapbox.com)
3. I prefer `yarn`, however, you still need `npm` to install it.
    Personally, I like `yarn 4+` -- if you'd like to use it, follow these [instructions](https://yarnpkg.com/blog/release/4.0).
4. Run `yarn --version` in the terminal, if you do not see a version 4+, do the following

    Install `npm`:

    ```sh
    npm install npm@latest -g
    ```

    Install `yarn`:

    ```sh
    npm install --global yarn
    ```

### Installation

1. Clone the repo

    ```sh
    git clone https://github.com/dah007/f1sp.git
    ```

2. Install NPM packages

    ```sh
    yarn
    ```

3. Enter your sensitive data in the `.env` making sure it is stored outside of the project source code (`./src`).

    ```js
    API_PORT=3000
    DB_TYPE=sqlite|mysql
    MYSQL_CONNECTION_PWD=<<top secret pw>>
    MYSQL_PORT=3306
    VITE_MAPBOX_ACCESS_TOKEN='<<get from mapbox>>'
    ```

4. Change git remote url to avoid accidental pushes to base project

    ```sh
    git remote set-url origin dah007/f1sp
    git remote -v # confirm the changes
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

You can start the website with `start.sh` (note, this does require `yarn` to be run)

You can access the [Swagger API Docs](http://localhost:3000/api-docs/#/default) and the `API_PORT` defined above (defaults to 3000)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

<input type="checkbox" disabled /> Include open sourced driver images

<input type="checkbox" disabled /> More automated updates

<input type="checkbox" disabled /> More cowbell

See the [open issues](https://github.com/dah007/f1sp/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- 
### Top contributors

<a href="https://github.com/dah007/f1sp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dah007/f1sp" alt="contrib.rocks image" />
</a> -->

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Demian H. - <dholmberg@gmail.com>

Project Link: [https://github.com/dah007/f1sp](https://github.com/dah007/f1sp)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   [F1DB](https://github.com/f1db/f1db) -- without this db, and the endless work involved -- I would be able to do any of this. THANK YOU! :)
-   [f1-circuits](https://github.com/bacinger/f1-circuits) -- thank you for open sourcing geoJSON data on the tracks.
-   [Best README Template](https://github.com/othneildrew/Best-README-Template)
-   [md-badges](https://github.com/inttter/md-badges)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[React-url]: https://reactjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React_Router-shield]: https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white
[React_Router-url]: https://reactrouter.com/
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff
[TypeScript-url]: https://www.typescriptlang.org/
[VSCode-shield]: https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white
[VSCode-url]: https://code.visualstudio.com/
[ViteJS-shield]: https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff
[ViteJS-url]: https://vitejs.dev
[contributors-shield]: https://img.shields.io/github/contributors/dah007/f1sp.svg?style=for-the-badge
[contributors-url]: https://github.com/dah007/f1sp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dah007/f1sp.svg?style=for-the-badge
[forks-url]: https://github.com/dah007/f1sp/network/members
[issues-shield]: https://img.shields.io/github/issues/dah007/f1sp.svg?style=for-the-badge
[issues-url]: https://github.com/dah007/f1sp/issues
[license-shield]: https://img.shields.io/github/license/dah007/f1sp.svg?style=for-the-badge
[license-url]: https://github.com/dah007/f1sp/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/dah007/
[stars-shield]: https://img.shields.io/github/stars/dah007/f1sp.svg?style=for-the-badge
[stars-url]: https://github.com/dah007/f1sp/stargazers
