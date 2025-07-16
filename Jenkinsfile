pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = 'YOUR_DOCKER_HUB_USERNAME/webapp'
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/YOUR_USERNAME/webapp-cicd.git'
            }
        }
        
        stage('Test') {
            steps {
                script {
                    sh 'npm test'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.withRegistry('https://registry-1.docker.io/v2/', 'docker-hub-credentials') {
                        image.push("${BUILD_NUMBER}")
                        image.push("latest")
                    }
                }
            }
        }
        
        stage('Deploy to EKS') {
            steps {
                script {
                    sh '''
                        aws eks update-kubeconfig --region ap-southeast-1 --name my-cluster
                        sed -i "s|YOUR_DOCKER_HUB_USERNAME/webapp:latest|${DOCKER_IMAGE}:${BUILD_NUMBER}|g" k8s/deployment.yaml
                        kubectl apply -f k8s/deployment.yaml
                        kubectl rollout status deployment/webapp-deployment
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh '''
                        sleep 30
                        kubectl get service webapp-service
                        EXTERNAL_IP=$(kubectl get service webapp-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                        echo "Application deployed at: http://$EXTERNAL_IP"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
