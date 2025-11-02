pipeline {
  agent any

  tools {
    nodejs 'NodeJS20'  // matches your tool name
  }

  options {
    timestamps()
    durabilityHint('PERFORMANCE_OPTIMIZED')
  }

  environment {
    CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/Cypress"
    APP_URL = "http://localhost:3000"   // adjust if your dev server differs
  }

  stages {

    stage('Gate: Allowed Branches') {
      when { beforeAgent true }
      steps {
        script {
          def allowed = ['DEV','QA','main']
          def branch  = env.BRANCH_NAME ?: 'unknown'
          if (!allowed.contains(branch)) {
            echo "Branch '${branch}' not allowed. Marking build NOT_BUILT."
            currentBuild.result = 'NOT_BUILT'
            // Stop the pipeline gracefully
            error("Stopping: branch not in ${allowed}")
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
        script {
          if (isUnix()) {
            sh 'git fetch --unshallow || true'
          } else {
            bat 'git fetch --unshallow || exit /b 0'
          }
        }
      }
    }

    stage('Node & Install') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              echo "Node: $(node -v)"
              echo "NPM : $(npm -v)"
              if [ -f package-lock.json ]; then npm ci; else npm install; fi
              npm install --save-dev cross-env
              npm install react@18 react-dom@18
              npx browserslist@latest --update-db
            '''
          } else {
            bat """
              echo Node: %node_version%
              node -v
              echo NPM :
              npm -v
              if exist package-lock.json ( npm ci ) else ( npm install )
              npm install --save-dev cross-env
              npm install react@18 react-dom@18
              npx browserslist@latest --update-db
            """
          }
        }
      }
    }

    stage('Lint') {
      steps {
        script {
          isUnix() ? sh('npm run eslint') : bat('npm run eslint')
        }
      }
    }

    stage('Build') {
      steps {
        script {
          isUnix() ? sh('npm run build:ci') : bat('npm run build:ci')
        }
      }
    }

    stage('Unit Tests') {
      steps {
        script {
          // If you emit JUnit XML, make sure your npm test does so
          isUnix() ? sh('npm test') : bat('npm test')
        }
      }
    }

    stage('E2E (Cypress)') {
      steps {
        script {
          // Cross-platform server start + wait + run E2E + auto stop
          // Uses npx to avoid adding a permanent devDependency
          def cmd = "npx --yes start-server-and-test start ${env.APP_URL} \"npm run test:e2e\""
          if (isUnix()) {
            sh '''
              npx cypress install || true
            '''
            sh cmd
          } else {
            bat 'npx cypress install || exit /b 0'
            bat cmd
          }
        }
      }
    }
  }

  post {
    always {
      // Collect logs if you still produce any (optional)
      script {
        if (isUnix()) {
          sh 'if [ -f server.log ]; then tail -n 200 server.log || true; fi'
        } else {
          bat 'if exist server.log ( powershell -Command "Get-Content server.log -Tail 200" )'
        }
      }
      junit allowEmptyResults: true, testResults: '**/junit-*.xml'
      archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
    }
  }
}
