pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "openshift-learn"
        DOCKER_REGISTRY = "docker.io"
        OPENSHIFT_PROJECT = "openshift-learn"
        OPENSHIFT_APP = "openshift-learn"
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', 
                    url: 'https://github.com/omptech/openshift-learn.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                script {
                    sh '''
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Test Application') {
            steps {
                echo "Testing application..."
                script {
                    sh '''
                        docker run --rm ${DOCKER_IMAGE}:${BUILD_NUMBER} node -v
                        echo "Node.js test passed"
                    '''
                }
            }
        }
        
        stage('Deploy to OpenShift') {
            steps {
                echo "Deploying to OpenShift..."
                script {
                    withCredentials([string(credentialsId: 'openshift-token', variable: 'OPENSHIFT_TOKEN'),
                                     string(credentialsId: 'openshift-url', variable: 'OPENSHIFT_URL')]) {
                        sh '''
                            oc login --token=${OPENSHIFT_TOKEN} --server=${OPENSHIFT_URL} --insecure-skip-tls-verify
                            
                            # Create project if it doesn't exist
                            oc new-project ${OPENSHIFT_PROJECT} || true
                            
                            # Switch to project
                            oc project ${OPENSHIFT_PROJECT}
                            
                            # Deploy or update
                            oc new-app ${DOCKER_IMAGE}:${BUILD_NUMBER} --name=${OPENSHIFT_APP} || \
                            oc set image deployment/${OPENSHIFT_APP} ${OPENSHIFT_APP}=${DOCKER_IMAGE}:${BUILD_NUMBER}
                            
                            # Expose service
                            oc expose svc/${OPENSHIFT_APP} || true
                            
                            # Get route
                            echo "Application deployed at: $(oc get route ${OPENSHIFT_APP} -o jsonpath='{.spec.host}')"
                        '''
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                script {
                    withCredentials([string(credentialsId: 'openshift-token', variable: 'OPENSHIFT_TOKEN'),
                                     string(credentialsId: 'openshift-url', variable: 'OPENSHIFT_URL')]) {
                        sh '''
                            oc login --token=${OPENSHIFT_TOKEN} --server=${OPENSHIFT_URL} --insecure-skip-tls-verify
                            oc project ${OPENSHIFT_PROJECT}
                            oc rollout status deployment/${OPENSHIFT_APP}
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
