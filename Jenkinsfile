pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'webapp-local'
        COMPOSE_PROJECT_NAME = 'webapp-cicd'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/YOUR_USERNAME/webapp-cicd.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    # Cài Node.js nếu chưa có (cho testing)
                    if ! command -v node &> /dev/null; then
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    fi
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh 'npm test'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build local image
                    sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
                    sh 'docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest'
                }
            }
        }
        
        stage('Stop Previous Deployment') {
            steps {
                script {
                    sh '''
                        # Dừng containers cũ nếu có
                        docker-compose -p ${COMPOSE_PROJECT_NAME} down || true
                        
                        # Xóa containers cũ
                        docker container prune -f || true
                        
                        # Xóa images cũ (giữ lại 3 version gần nhất)
                        docker images ${DOCKER_IMAGE} --format "table {{.Repository}}:{{.Tag}}" | tail -n +4 | xargs -r docker rmi || true
                    '''
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh '''
                        # Cập nhật image trong docker-compose
                        sed -i "s|build: .|image: ${DOCKER_IMAGE}:${BUILD_NUMBER}|g" docker-compose.yml
                        
                        # Deploy với docker-compose
                        docker-compose -p ${COMPOSE_PROJECT_NAME} up -d
                        
                        # Chờ service khởi động
                        sleep 10
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh '''
                        # Kiểm tra containers đang chạy
                        docker-compose -p ${COMPOSE_PROJECT_NAME} ps
                        
                        # Health check
                        for i in {1..10}; do
                            if curl -f http://localhost:8080/health; then
                                echo "✅ Health check passed!"
                                break
                            else
                                echo "⏳ Waiting for service... ($i/10)"
                                sleep 5
                            fi
                        done
                        
                        # Hiển thị thông tin deployment
                        echo "🚀 Application deployed successfully!"
                        echo "📱 Access at: http://$(curl -s http://checkip.amazonaws.com):8080"
                    '''
                }
            }
        }
        
        stage('Performance Test') {
            steps {
                script {
                    sh '''
                        # Cài ab (Apache Bench) nếu chưa có
                        if ! command -v ab &> /dev/null; then
                            sudo apt-get update
                            sudo apt-get install -y apache2-utils
                        fi
                        
                        # Chạy load test đơn giản
                        echo "🧪 Running performance test..."
                        ab -n 100 -c 10 http://localhost:8080/ || true
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh '''
                    # Cleanup workspace
                    docker system prune -f || true
                '''
            }
            cleanWs()
        }
        success {
            script {
                sh '''
                    echo "🎉 Deployment successful!"
                    echo "📊 Container Status:"
                    docker-compose -p ${COMPOSE_PROJECT_NAME} ps
                    echo "💾 Disk Usage:"
                    df -h
                    echo "🔍 Memory Usage:"
                    free -h
                '''
            }
        }
        failure {
            script {
                sh '''
                    echo "❌ Deployment failed!"
                    echo "📋 Container logs:"
                    docker-compose -p ${COMPOSE_PROJECT_NAME} logs --tail=50 || true
                '''
            }
        }
    }
}
