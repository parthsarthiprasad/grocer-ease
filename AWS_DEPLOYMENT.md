# AWS Deployment Guide for GrocerEase

This guide outlines the steps to deploy the GrocerEase application to AWS using Docker containers and AWS services.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Docker installed locally
4. AWS ECR (Elastic Container Registry) repository created
5. AWS ECS (Elastic Container Service) cluster created
6. AWS RDS (MongoDB) instance created
7. AWS Route 53 domain (optional)

## Deployment Steps

### 1. Prepare the Application

1. Update environment variables:
   ```bash
   # backend/.env
   NODE_ENV=production
   MONGODB_URI=<your-rds-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   PORT=5000

   # frontEndReactApp/.env
   REACT_APP_API_URL=<your-backend-url>
   ```

2. Build Docker images:
   ```bash
   # Build backend
   cd backend
   docker build -t grocer-ease-backend .

   # Build frontend
   cd ../frontEndReactApp
   docker build -t grocer-ease-frontend .
   ```

### 2. Push Images to ECR

1. Authenticate with ECR:
   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
   ```

2. Tag and push images:
   ```bash
   # Backend
   docker tag grocer-ease-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/grocer-ease-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/grocer-ease-backend:latest

   # Frontend
   docker tag grocer-ease-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/grocer-ease-frontend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/grocer-ease-frontend:latest
   ```

### 3. Deploy to ECS

1. Create Task Definitions:
   - Create task definition for backend service
   - Create task definition for frontend service
   - Configure environment variables and container settings

2. Create Services:
   - Create backend service
   - Create frontend service
   - Configure load balancers and auto-scaling

3. Configure Security Groups:
   - Allow inbound traffic on port 80 (frontend)
   - Allow inbound traffic on port 5000 (backend)
   - Allow MongoDB access from backend service

### 4. Configure DNS (Optional)

1. Create Route 53 records:
   - Point domain to frontend load balancer
   - Create subdomain for API (e.g., api.grocerease.com)

### 5. Monitoring and Maintenance

1. Set up CloudWatch:
   - Create log groups
   - Set up metrics and alarms
   - Configure log retention

2. Configure Auto Scaling:
   - Set up scaling policies
   - Configure target tracking
   - Set up notifications

## Security Considerations

1. Use AWS Secrets Manager for sensitive data
2. Enable AWS WAF for web application firewall
3. Configure SSL/TLS certificates
4. Implement proper IAM roles and policies
5. Regular security updates and patches

## Cost Optimization

1. Use AWS Free Tier where possible
2. Implement auto-scaling based on demand
3. Use reserved instances for predictable workloads
4. Monitor and optimize resource usage

## Backup and Recovery

1. Configure MongoDB backups
2. Set up disaster recovery procedures
3. Document recovery steps
4. Regular testing of backup and recovery

## Maintenance

1. Regular updates of dependencies
2. Monitoring of application health
3. Performance optimization
4. Security patches and updates

## Troubleshooting

1. Check CloudWatch logs
2. Monitor ECS service events
3. Verify security group settings
4. Check container health status
5. Review application logs

## Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Docker Documentation](https://docs.docker.com/) 