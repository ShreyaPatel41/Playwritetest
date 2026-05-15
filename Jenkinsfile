pipeline {
    agent any

    tools {
        // NOTE: You must have the NodeJS plugin installed in Jenkins 
        // and configured with a tool named 'nodejs'
        nodejs 'nodejs' 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Using 'bat' because your Jenkins is running on Windows
                bat 'npm ci'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Setting CI=true forces Playwright to run in headless mode
                withEnv(['CI=true']) {
                    bat 'npx playwright test'
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
    }
}
