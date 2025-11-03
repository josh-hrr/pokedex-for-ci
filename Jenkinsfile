pipeline {
  agent any
  tools { nodejs 'NodeJS20' }

  environment { 
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
          npm install
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
