export const setEnviromentVariables = () => {
    try {
      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error('SECRET environment variable is not provided.');
      }
  
      const secretJson = JSON.parse(secret);
      const requiredKeys = ['TABLE_NAME', 'PORT', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION', 'COGNITO_USER_POOL_ID', 'COGNITO_CLIENT_ID'];
  
      requiredKeys.forEach(key => {
        if (!secretJson[key]) {
          throw new Error(`Required key not found in secret: ${key}`);
        }
        process.env[key] = secretJson[key];
      });
    
    } catch (error) {
      console.error(error);
      process.exit(1); // Exit the application if secrets can't be loaded.
    }
  }
  