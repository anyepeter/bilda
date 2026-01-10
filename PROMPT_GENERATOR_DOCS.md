# Prompt Generator - Technical Documentation

## Overview

The Prompt Generator is a production-ready feature that helps non-technical users create high-quality AI prompts for building software applications. Users answer simple questions about their desired application, and the system generates a detailed, structured prompt that can be used with AI assistants like Claude or ChatGPT.

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: Custom components styled with Tailwind
- **Animation**: Framer Motion
- **API Integration**: OpenAI GPT-4o-mini
- **Authentication**: Clerk (already integrated)

### File Structure

```
app/
├── prompt/
│   └── page.tsx                 # Main prompt generation UI
├── api/
│   └── generate-prompt/
│       └── route.ts             # API route for OpenAI integration
components/
└── ui/
    ├── Button.tsx               # Button component (with asChild support)
    ├── Card.tsx                 # Card wrapper component
    ├── Label.tsx                # Form label component
    ├── Select.tsx               # Select dropdown component
    ├── Checkbox.tsx             # Checkbox with label component
    ├── Textarea.tsx             # Textarea component
    └── Input.tsx                # Input field component
```

## Features

### 1. Form Sections

#### Application Type (Required)
- Website
- E-commerce Store
- SaaS Application
- Mobile App
- Admin Dashboard
- Blog/Content Platform
- Social Media Platform

#### Features (Optional, Multi-select)
- Authentication
- Payments
- Admin Panel
- User Dashboard
- Notifications
- API Integration

#### Design Preferences (Required)
- **Design Style**: Modern, Minimal, Dark, Corporate, Playful, Elegant
- **Target Platform**: Web, Mobile, Web & Mobile

#### Skill Level (Required)
- Non-technical
- Beginner
- Intermediate
- Advanced

#### Additional Information (Optional)
- Free-text field for specific requirements

### 2. API Integration

#### Endpoint: `/api/generate-prompt`

**Method**: POST

**Request Body**:
```json
{
  "appType": "SaaS Application",
  "features": ["User authentication and authorization", "Payment processing integration"],
  "designStyle": "Modern",
  "platform": "Web",
  "skillLevel": "Beginner",
  "additionalInfo": "Need Stripe integration and user roles"
}
```

**Response** (Success):
```json
{
  "success": true,
  "prompt": "You are a senior software engineer...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 800,
    "total_tokens": 950
  }
}
```

**Response** (Error):
```json
{
  "error": "Invalid API key. Please check your OpenAI API key configuration."
}
```

### 3. Prompt Construction Logic

The system constructs a structured prompt that includes:

1. **Context Setting**: Defines the AI's role as a senior software engineer
2. **Application Details**: Type, platform, design style
3. **Skill Level Targeting**: Tailors complexity to user's experience
4. **Feature Requirements**: Lists all selected features
5. **Additional Requirements**: Includes custom user input
6. **Output Structure**: Requests specific format (Overview, Tech Stack, Implementation Steps, etc.)

### 4. Security

- **API Key Protection**: OpenAI API key stored in environment variables, never exposed to client
- **Server-Side Processing**: All OpenAI calls happen server-side via API routes
- **Route Protection**: Page protected by Clerk authentication middleware
- **Error Handling**: Graceful error messages without exposing sensitive details

## Setup Instructions

### 1. Install Dependencies

```bash
npm install openai
```

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### 3. Update Clerk Redirects (Already Done)

The `.env.local` already has:
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/prompt
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/prompt
```

### 4. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Sign in or create an account

3. You'll be redirected to `/prompt`

4. Fill out the form and click "Generate My Prompt"

5. Copy the generated prompt and use it with any AI assistant

## Component Documentation

### Page Component (`app/prompt/page.tsx`)

**State Management**:
- `formData`: Stores all form input values
- `generatedPrompt`: Stores the AI-generated response
- `isLoading`: Loading state during API call
- `error`: Error messages
- `copied`: Clipboard copy confirmation state

**Key Functions**:
- `handleFeatureToggle()`: Manages checkbox selections
- `handleGenerate()`: Validates form, calls API, handles response
- `handleCopy()`: Copies prompt to clipboard
- `handleReset()`: Clears form and output

### API Route (`app/api/generate-prompt/route.ts`)

**Features**:
- OpenAI client initialization with API key from environment
- Request validation
- Prompt construction helper function
- Comprehensive error handling
- Token usage tracking

**Error Handling**:
- 400: Missing required fields
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: General server errors

## UI/UX Design Principles

### Simplicity
- Clear section headers
- Friendly microcopy
- Visual hierarchy with consistent spacing
- Required fields marked with asterisk

### Responsiveness
- Mobile-first design
- Grid layouts adapt to screen size
- Touch-friendly form controls

### Feedback
- Loading states with spinner
- Error messages with red styling
- Success state with green check icon
- Copy confirmation feedback
- Smooth animations with Framer Motion

### Accessibility
- Semantic HTML
- Label associations
- Focus states
- Keyboard navigation support

## Cost Optimization

### Model Selection
Using **GPT-4o-mini** instead of GPT-4:
- ~30x cheaper per token
- Sufficient quality for prompt generation
- Faster response times

### Token Management
- Maximum 2000 completion tokens
- Typical cost per generation: $0.001 - $0.003
- Monthly estimate (1000 users, 5 prompts each): ~$5-15

## Customization Guide

### Adding New Application Types

Edit `app/prompt/page.tsx`:

```tsx
<option value="Portfolio Website">Portfolio Website</option>
```

### Adding New Features

Edit the `featureOptions` array:

```tsx
{
  id: 'search',
  label: 'Search Functionality',
  value: 'Advanced search with filters'
}
```

### Modifying Prompt Structure

Edit `app/api/generate-prompt/route.ts`, function `constructPrompt()`:

```typescript
return `You are a senior software engineer...
[Your custom prompt structure]`
```

### Changing AI Model

Edit `app/api/generate-prompt/route.ts`:

```typescript
model: 'gpt-4o', // or 'gpt-4-turbo', 'gpt-3.5-turbo'
```

## Testing Checklist

- [ ] Form validation works (required fields)
- [ ] Loading state displays during generation
- [ ] Error messages display correctly
- [ ] Generated prompt appears in output section
- [ ] Copy button works and shows confirmation
- [ ] Reset button clears form and output
- [ ] Mobile responsive layout works
- [ ] Authentication redirects to /prompt page
- [ ] Authenticated users can generate prompts
- [ ] API errors are handled gracefully

## Production Deployment

### Environment Variables (Vercel)

Add to Vercel dashboard:
```
OPENAI_API_KEY=sk-...
```

### Build Process

The app will build successfully with:
```bash
npm run build
```

### Monitoring

Track in production:
- API response times
- OpenAI token usage
- Error rates
- User generation patterns

## Future Enhancements

### Potential Features
1. **Prompt History**: Save and view previous generations
2. **Prompt Templates**: Pre-built templates for common use cases
3. **Share Functionality**: Share prompts via link
4. **Prompt Ratings**: Let users rate prompt quality
5. **Multi-language Support**: Generate prompts in different languages
6. **Advanced Options**: Temperature, max tokens controls
7. **Export Formats**: PDF, Markdown export
8. **Follow-up Questions**: Iterative prompt refinement

### Database Integration
Consider adding:
- User prompt history
- Analytics tracking
- Usage limits per user tier
- Favorite prompts

## Support & Troubleshooting

### Common Issues

**"Invalid API key"**
- Check `.env.local` has correct `OPENAI_API_KEY`
- Restart dev server after adding key
- Verify key is valid on OpenAI dashboard

**"Rate limit exceeded"**
- Wait a few minutes
- Upgrade OpenAI plan if needed
- Implement rate limiting per user

**Build errors**
- Run `npm install` to ensure all dependencies installed
- Check TypeScript errors: `npm run build`
- Verify all imports are correct

## Contact

For questions or issues with this implementation, refer to:
- Next.js docs: https://nextjs.org/docs
- OpenAI API docs: https://platform.openai.com/docs
- Clerk docs: https://clerk.com/docs
