# Project Title: [DbHackathon2025 finChatIonicApp]

A finacial app which provide goverment schemes related details and general financial learning.

---

## Table of Contents
1.  [Setup & Run on macOS](#setup--run-on-macos)
    * [Prerequisites for macOS](#prerequisites-for-macos)
    * [Getting Started on macOS](#getting-started-on-macos)
    * [Running in the Browser on macOS](#running-in-the-browser-on-macos)
    * [Building for iOS on macOS](#building-for-ios-on-macos)
    * [Building for Android on macOS](#building-for-android-on-macos)
2.  [Setup & Run on Windows](#setup--run-on-windows)
    * [Prerequisites for Windows](#prerequisites-for-windows)
    * [Getting Started on Windows](#getting-started-on-windows)
    * [Running in the Browser on Windows](#running-in-the-browser-on-windows)
    * [Building for Android on Windows](#building-for-android-on-windows)
    * [A Note on iOS Development](#a-note-on-ios-development)
3.  [Project Structure](#project-structure)
4.  [Key Dependencies](#key-dependencies)
5.  [Contributing](#contributing)

---

## Setup & Run on macOS

This section provides complete instructions to set up and run the project on a macOS machine.

### Prerequisites for macOS

* **Node.js & npm:** Download the LTS version from the [Node.js website](https://nodejs.org/).
    ```bash
    node -v
    npm -v
    ```
* **Ionic CLI:** Install the Ionic Command Line Interface globally.
    ```bash
    npm install -g @ionic/cli
    ```
* **Git:** Install Git from [git-scm.com](https://git-scm.com/downloads).
* **Xcode:** Install Xcode from the Mac App Store. This is required for building iOS apps.
* **Homebrew:** A package manager for macOS.
    ```bash
    /bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
    ```
* **CocoaPods:** A dependency manager for iOS projects.
    ```bash
    sudo gem install cocoapods
    ```
* **For Android Development (Optional):**
    * **Java Development Kit (JDK):** Download and install a recent version (e.g., OpenJDK).
    * **Android Studio:** Install from the [official Android developer website](https://developer.android.com/studio).

### Getting Started on macOS

1.  **Clone the Repository:**
    ```bash
    git clone [URL_TO_YOUR_GIT_REPOSITORY]
    cd [YOUR_PROJECT_FOLDER_NAME]
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running in the Browser on macOS

Start a local development server with live-reloading to view the app in your browser.
```bash
ionic serve
```

### Building for iOS on macOS

1.  **Add iOS Platform:** `ionic capacitor add ios`
2.  **Sync Project:** `ionic capacitor sync ios`
3.  **Open in Xcode:** `ionic capacitor open ios`
4.  **Run:** Use Xcode to run the app on a simulator or a connected physical device.

### Building for Android on macOS

1.  **Add Android Platform:** `ionic capacitor add android`
2.  **Sync Project:** `ionic capacitor sync android`
3.  **Open in Android Studio:** `ionic capacitor open android`
4.  **Run:** Use Android Studio to run the app on an emulator or a connected physical device.

---

## Setup & Run on Windows

This section provides complete instructions to set up and run the project on a Windows machine.

### Prerequisites for Windows

* **Node.js & npm:** Download the LTS version from the [Node.js website](https://nodejs.org/).
    ```bash
    node -v
    npm -v
    ```
* **Ionic CLI:** Install the Ionic Command Line Interface globally.
    ```bash
    npm install -g @ionic/cli
    ```
* **Git:** Install Git from [git-scm.com](https://git-scm.com/downloads).
* **Java Development Kit (JDK):** Download and install a recent version (e.g., OpenJDK).
* **Android Studio:** Install from the [official Android developer website](https://developer.android.com/studio). In the setup wizard, ensure you install:
    * Android SDK
    * Android SDK Platform-Tools
    * Android Virtual Device

### Getting Started on Windows

1.  **Clone the Repository:**
    ```bash
    git clone [URL_TO_YOUR_GIT_REPOSITORY]
    cd [YOUR_PROJECT_FOLDER_NAME]
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running in the Browser on Windows

Start a local development server with live-reloading to view the app in your browser.
```bash
ionic serve
```

### Building for Android on Windows

1.  **Add Android Platform:** `ionic capacitor add android`
2.  **Sync Project:** `ionic capacitor sync android`
3.  **Open in Android Studio:** `ionic capacitor open android`
4.  **Run:** Use Android Studio to run the app on an emulator or a connected physical device.

### A Note on iOS Development

Building an iOS application is **not possible on Windows**. The process requires Xcode and other macOS-specific tools. You must use a macOS machine to build the iOS version of the app.

---

## Project Structure

A brief overview of the key directories in an Ionic project:

```
/
├── android/            # Native Android project (generated)
├── ios/                # Native iOS project (generated)
├── node_modules/       # Project dependencies
├── src/                # Main source code for the app
│   ├── app/            # Core app module and routing
│   ├── assets/         # Images, fonts, and other static assets
│   ├── environments/   # Environment-specific settings
│   └── theme/          # Global theme and styling variables
├── angular.json        # Angular CLI configuration
├── capacitor.config.ts # Capacitor configuration
├── ionic.config.json   # Ionic project configuration
└── package.json        # npm dependencies and scripts
```

---

## Key Dependencies

* **[Ionic Framework](https://ionicframework.com/):** UI toolkit for building cross-platform apps.
* **[Angular](https://angular.io/):** The application framework.
* **[Capacitor](https://capacitorjs.com/):** Native runtime for building web apps that run on iOS, Android, and the Web.
* **[TypeScript](https://www.typescriptlang.org/):** The primary language used for development.

---

## Contributing

Contributions are welcome! If you have suggestions or want to improve the app, please follow these steps:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
