pipeline {
    agent any // This specifies that the pipeline can run on any available agent

    environment {
        // Define the ECR-related environment variables
        ECR_REGISTRY = '637423235266.dkr.ecr.us-east-1.amazonaws.com'
        IMAGE_REPO_NAME = 'workspace-service'
        IMAGE_TAG = 'latest'


        // Define ECS-related environment variables
        ECS_CLUSTER_NAME = 'FargateServiceStack-FargateServiceStackCluster15109166-uPTHRsRRreZC'
        ECS_SERVICE_NAME = 'FargateServiceStack-WorkspaceServiceFargateServiceEC86F408-qZQ1y1P5tIv3'
        ECS_TASK_FAMILY_NAME = 'FargateServiceStackWorkspaceServiceTaskDefinition943E1AD3'
        ECS_TASK_DEFINITION_FILE = 'FargateServiceStackWorkspaceServiceTaskDefinition943E1AD3-revision7.json' // Path relative to the repo root

        // Define AWS environment variables
        AWS_DEFAULT_REGION = 'us-east-1'
        AWS_CREDENTIALS_ID = 'AWS_ACCESS_SECRET_KEYS' // Assuming you have this setup in Jenkins credentials
    
          // ECS Service Configuration
        ECS_DESIRED_COUNT = '1'
        ECS_LAUNCH_TYPE = 'FARGATE'

        // Network Configuration for ECS Service
        ECS_SUBNET_ID = 'subnet-0a5e64aa9ee3ebd7f, subnet-048488bb7a93cb1ec'
        ECS_SECURITY_GROUP_ID = 'sg-0c09aa54ec055c147' 
    }
    

   stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }


stage('Build and Tag Image') {
    steps {
            // Copy the environment file to the service directory or reference it during the build
            dir('services/workspace-service') {
                echo "Copying the environment file for the build process..."
                // Build the Docker image while ensuring the environment variables are respected
                bat "docker build -t  ${ECR_REGISTRY}/${IMAGE_REPO_NAME}:${IMAGE_TAG} -f Dockerfile ."
                bat "docker tag ${ECR_REGISTRY}/${IMAGE_REPO_NAME}:${IMAGE_TAG} ${ECR_REGISTRY}/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
            }
        
        
    }
}


stage('Push to ECR') {
    steps {
        // Using withCredentials to securely handle AWS credentials
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding', 
            credentialsId: 'AWS_ACCESS_SECRET_KEYS', 
            accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
            secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
            script {
                try {
                    // Attempt to log into AWS ECR with provided credentials
                    echo "Logging into AWS ECR..."

                    bat script: "aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin %ECR_REGISTRY%", returnStdout: true
                    echo "AWS ECR login successful."

                    // Listing available Docker images for verification
                    echo "Listing available Docker images..."
                    bat "docker images"

                    // Pushing the Docker image to AWS ECR
                    echo "Pushing Docker image to ECR..."
                    bat "docker push %ECR_REGISTRY%/%IMAGE_REPO_NAME%:%IMAGE_TAG%"
                    echo "Docker image pushed successfully."
                } catch (Exception e) {
                    // Catching and logging any errors that occur during the process
                    echo "Error encountered during AWS ECR operations: ${e.getMessage()}"
                    error "Failed to execute AWS ECR operations."
                }
            }
        }
    }
}



        
stage('Deploy to ECS') {
    steps {
        script {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS_ID]]) {
                // Deploy the Docker image to ECS service
                bat "aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --task-definition ${ECS_TASK_FAMILY_NAME} --desired-count ${ECS_DESIRED_COUNT} --network-configuration \"awsvpcConfiguration={subnets=[${ECS_SUBNET_ID}],securityGroups=[${ECS_SECURITY_GROUP_ID}],assignPublicIp=ENABLED}\" --region ${AWS_DEFAULT_REGION}"
            }
        }
    }
}


        stage('Test') {
            steps {
                bat 'echo Running tests...'
            }
        }

        stage('Deploy') {
            steps {
                bat 'echo Deploying application...'
            }
        }
    }

}



      
        // stage('Test') {
        //     steps {
        //         // Replace the following command with the command that tests your project
        //         echo 'Testing..'
                
        //     }
        // }
 