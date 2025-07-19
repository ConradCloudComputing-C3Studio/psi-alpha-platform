import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import { type Schema } from '@/amplify/data/resource'

// Configure Amplify
export function configureAmplify() {
  try {
    Amplify.configure({
      API: {
        GraphQL: {
          endpoint: process.env.NEXT_PUBLIC_AMPLIFY_GRAPHQL_ENDPOINT || '',
          region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1',
          defaultAuthMode: 'userPool'
        }
      },
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_ID || '',
          userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID || '',
          region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1',
          signUpVerificationMethod: 'email'
        }
      },
      Storage: {
        S3: {
          bucket: process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET || '',
          region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1'
        }
      }
    })
  } catch (error) {
    console.error('Error configuring Amplify:', error)
  }
}

// Create GraphQL client
export const client = generateClient<Schema>()

// Auth utilities
export const authConfig = {
  userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_ID || '',
  userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID || '',
  region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1'
}

// API utilities
export const apiConfig = {
  endpoint: process.env.NEXT_PUBLIC_AMPLIFY_GRAPHQL_ENDPOINT || '',
  region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1'
}

// Storage utilities
export const storageConfig = {
  bucket: process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET || '',
  region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1'
}

