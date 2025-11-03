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

    stage('SonarQube Scan') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        script {
          def scannerHome = tool name: 'SonarScanner7.3', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
          withSonarQubeEnv('SonarQube2025') {
            bat """
              "${scannerHome}\\bin\\sonar-scanner.bat" ^
                -Dsonar.login=squ_1aeb0dab1b4aa3687bce399e5c7f37695ef2cd40
            """
          }
        }
      }
    }


    stage('Quality Gate') {
    when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
    steps {
      timeout(time: 10, unit: 'MINUTES') {
        waitForQualityGate abortPipeline: true
      }
    }
  }

    
  } 
}
