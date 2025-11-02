pipeline {
  agent any
  tools { nodejs 'NodeJS20' }

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

    stage('Start app (background)') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps {
        bat '''
          powershell -NoProfile -Command ^
            "$p = Start-Process -FilePath npm -ArgumentList 'start' -RedirectStandardOutput server.log -RedirectStandardError server.log -PassThru; ^
             $p.Id | Out-File -FilePath server.pid -Encoding ascii"
        '''
      }
    }

    stage('E2E Tests (cypress action equivalent)') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps { bat 'npx cypress run --config-file cypress.config.js' }
    }

    stage('Run Cypress E2E tests') {
      when { anyOf { branch 'DEV'; branch 'QA'; branch 'main' } }
      steps { bat 'npm run test:e2e' }
    }
  }

  post {
    always {
      bat '''
        if exist server.pid (
          for /f "usebackq delims=" %%p in ("server.pid") do powershell -NoProfile -Command "Stop-Process -Id %%p -ErrorAction SilentlyContinue"
          del /f /q server.pid
        )
        if exist server.log (
          powershell -NoProfile -Command "Get-Content server.log -TotalCount 200 | ForEach-Object { $_ }"
        )
      '''
    }
  }
}
