# Environment Variables Setup

The application requires several environment variables to function properly. Create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

### Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
# Note: CLERK_SECRET_KEY is now handled by your backend service
# The frontend only needs the publishable key
```

### Supabase Database

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### OpenAI

```
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Stripe Billing

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PRICE_PLUS=price_your_stripe_plus_price_id_here
STRIPE_PRICE_PRO=price_your_stripe_pro_price_id_here
```

### AWS S3

```
AWS_REGION=us-east-1
S3_BUCKET=your_s3_bucket_name_here
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
```

### Email (Resend)

```
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=re_your_resend_api_key_here
```

### App Configuration

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-api-url.com
# or for local development:
# NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

## Setup Instructions

1. Copy the variables above into a `.env.local` file
2. Replace the placeholder values with your actual API keys and configuration
3. Restart your development server after adding the environment variables

## Services to Set Up

- **Clerk**: For authentication (https://clerk.com)
- **Supabase**: For database (https://supabase.com)
- **OpenAI**: For AI features (https://openai.com)
- **Stripe**: For billing (https://stripe.com)
- **AWS S3**: For file storage (https://aws.amazon.com/s3/)
- **Resend**: For email (https://resend.com)

## Testing Environment Variables

Run the health check script to verify all variables are set:

```bash
npx tsx scripts/health/check-env.ts
```

This will show which variables are missing and need to be configured.
