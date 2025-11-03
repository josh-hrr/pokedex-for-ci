pipeline {
  agent any
  tools { nodejs 'NodeJS20_11' }

  environment { 
    CYPRESS_CACHE_FOLDER = "${WORKSPACE}\\.cache\\Cypress"
    CI = 'true'
  }


  stages {
    stage('Checkout') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        bat '''
          rem --- wipe previous install & caches (Windows locks cause corrupt installs) ---
          if exist node_modules rmdir /s /q node_modules
          if exist "%WORKSPACE%\\.npm-cache" rmdir /s /q "%WORKSPACE%\\.npm-cache"
          npm cache clean --force

          rem keep npm cache inside workspace (avoid systemprofile)
          npm config set cache "%WORKSPACE%\\.npm-cache" --location=project

          rem IMPORTANT: skip lifecycle scripts so Cypress postinstall won't run
          set npm_config_ignore_scripts=true

          rem clean, deterministic install (uses package-lock.json)
          if exist package-lock.json (
            npm ci
          ) else (
            npm install
          )

          rem the rest of your commands
          npm install --save-dev cross-env
          npm install react@18 react-dom@18
          npx browserslist@latest --update-db
        '''
      }
    }

    stage('Lint') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps { bat 'npm run eslint' }
    }

    stage('Build') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps { bat 'npm run build:ci' }
    }

    stage('Unit Tests') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps { bat 'npm test' }
    }  
  } 
}
