pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        IMAGE_NAME = 'my-website'
        KUBECONFIG = credentials('kubeconfig')
        AWS_REGION = 'us-west-2'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Chạy tests
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry('https://registry-1.docker.io/v2/', 'docker-hub-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to EKS') {
            steps {
                script {
                    // Cập nhật kubeconfig
                    sh 'aws eks update-kubeconfig --region ${AWS_REGION} --name my-website-cluster'
                    
                    // Thay thế image tag trong deployment
                    sh "sed -i 's|image: .*|image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}|' deployment.yaml"
                    
                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f deployment.yaml'
                    sh 'kubectl rollout status deployment/my-website'
                    
                    // Lấy thông tin service
                    sh 'kubectl get services'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Kiểm tra health của ứng dụng
                    sh '''
                        EXTERNAL_IP=$(kubectl get service my-website-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                        echo "Application URL: http://$EXTERNAL_IP"
                        
                        # Đợi service sẵn sàng
                        sleep 30
                        
                        # Health check
                        curl -f http://$EXTERNAL_IP || exit 1
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
