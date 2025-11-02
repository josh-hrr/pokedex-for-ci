pipeline {
  agent any

  tools { nodejs 'NodeJS20' }

  stages {
    stage('Checkout') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        checkout scm
        sh 'git fetch --unshallow || true' // fetch-depth: 0 equivalent
      }
    }

    stage('Install Dependencies') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh 'npm install'
        sh 'npm install --save-dev cross-env'
        sh 'npm install react@18 react-dom@18'
        sh 'npx browserslist@latest --update-db'
      }
    }

    stage('Lint') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh 'npm run eslint'
      }
    }

    stage('Build') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh 'npm run build:ci'
      }
    }

    stage('Unit Tests') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh 'npm test'
      }
    }

    stage('Start app (background)') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh '''
          nohup npm start > server.log 2>&1 &
          echo $! > server.pid
        '''
      }
    }

    stage('E2E Tests (cypress action equivalent)') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        // Equivalent to: uses: cypress-io/github-action@v2 with config-file
        sh 'npx cypress run --config-file cypress.config.js'
      }
    }

    stage('Run Cypress E2E tests') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        sh 'npm run test:e2e'
      }
    }
  }

  post {
    always {
      sh '''
        if [ -f server.pid ]; then
          kill $(cat server.pid) || true
          rm -f server.pid
        fi
        # optional: show last lines of server log for debugging
        if [ -f server.log ]; then
          tail -n +1 server.log | sed -n '1,200p'
        fi
      '''
    }
  }
}
