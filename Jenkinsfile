pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/1sGu7/lab8jenkins.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("my-web-app:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker stop web-app || true'
                sh 'docker rm web-app || true'
                sh "docker run -d -p 80:80 --name web-app my-web-app:${env.BUILD_ID}"
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
    }
}
