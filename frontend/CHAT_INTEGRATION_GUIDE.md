# Energy Concierge Chat UI - Integration Guide

## Overview

The Energy Concierge Chat feature has been fully integrated into your React frontend with a floating chat button that appears on all pages.

## What Was Created

### 1. **Type Definitions** (`src/types/chat.types.ts`)

- `Message` interface: Structure for chat messages with id, role, content, and timestamp
- `ChatResponse` interface: Backend response format

### 2. **API Service** (`src/api/chat.api.ts`)

- `chatApi.sendMessage(message: string)`: Sends user message to `/api/v1/chat` endpoint
- Proper error handling and type safety

### 3. **Custom Hook** (`src/features/chat/hooks/useChat.ts`)

- `useChat()`: Manages chat state (messages, loading, errors)
- Handles optimistic message insertion
- Auto-generates unique message IDs
- Includes default greeting from Energy Concierge

### 4. **UI Components** (`src/features/chat/components/`)

- **ChatMessage.tsx**: Renders individual chat bubbles with timestamp
  - User messages: Right-aligned, brand color background
  - Assistant messages: Left-aligned, gray background
- **ChatInput.tsx**: Text input form with send button
  - Disabled state while loading
  - Accessible with proper ARIA labels
- **ChatWidget.tsx**: Main chat container
  - Scrollable message history
  - Auto-scroll to latest messages
  - Gradient header with Energy Concierge branding
- **FloatingChatButton.tsx**: Global floating button
  - Fixed position (bottom-right)
  - Opens/closes chat widget
  - Responsive design (mobile-friendly)
  - Smooth animations

## Key Features

✅ **Global Availability**: Chat icon appears on every page
✅ **Responsive Design**: Mobile-optimized with Tailwind CSS
✅ **Dark Mode Support**: Automatically respects user's theme preference
✅ **Loading States**: Disabled input while waiting for API response
✅ **Error Handling**: Graceful error messages displayed in chat
✅ **Auto-scroll**: Always shows the latest messages
✅ **Type-Safe**: Full TypeScript support throughout

## Architecture

The feature follows your existing feature-sliced architecture:

```
src/
├── api/chat.api.ts                    # API calls
├── types/chat.types.ts                # Type definitions
└── features/chat/
    ├── hooks/useChat.ts               # State management
    ├── components/
    │   ├── ChatMessage.tsx            # Message bubble
    │   ├── ChatInput.tsx              # Input form
    │   ├── ChatWidget.tsx             # Main container
    │   └── FloatingChatButton.tsx     # Global button
    └── index.ts                       # Exports
```

## Integration Status

✅ **Already Integrated into App.tsx**
The `<FloatingChatButton />` component has been added to your main `App.tsx` file and will automatically appear on all pages.

No additional integration steps are required! The chat feature is ready to use.

## Customization Options

### Change Chat Colors

Edit the class names in components to match your brand:

```tsx
// In ChatWidget.tsx header
className = "bg-gradient-to-r from-brand to-brand-dark text-white";

// In ChatMessage.tsx for user messages
className = "bg-brand text-white";
```

### Adjust Widget Size

Modify the fixed dimensions in `FloatingChatButton.tsx`:

```tsx
<div className="fixed bottom-24 right-6 w-96 h-[600px]">
  {/* Change w-96 and h-[600px] to different sizes */}
</div>
```

### Custom Default Greeting

Edit the initial message in `useChat.ts`:

```tsx
const [messages, setMessages] = useState<Message[]>([
  {
    // ... modify this initial message
    content: "Your custom greeting here",
  },
]);
```

### Button Position

Modify position in `FloatingChatButton.tsx`:

```tsx
className = "fixed bottom-6 right-6 ..."; // Change bottom-6 right-6 to your preference
```

## Environment Configuration

Make sure your `.env.local` (frontend) has the correct API URL:

```
VITE_API_URL=http://localhost:3000/api/v1
```

This is already configured to use the backend's chat endpoint at `/chat`.

## Testing

To test the chat feature:

1. **Start the backend**: `npm run dev` in the backend folder
2. **Start the frontend**: `npm run dev` in the frontend folder
3. **Look for the chat icon**: Bottom-right corner of any page
4. **Click the icon**: Widget opens
5. **Type a message**: Try asking about energy consumption or electricity bills
6. **Verify response**: The Energy Concierge should respond through Groq

## Troubleshooting

### Chat widget doesn't appear

- Check if `FloatingChatButton` is imported in App.tsx ✅ (Already done)
- Verify z-index isn't being overridden by other elements

### Messages not sending

- Check backend is running on http://localhost:3000
- Verify GROQ_API_KEY is set in backend `.env`
- Open browser DevTools (F12) and check Network tab for errors

### Styling issues

- Ensure Tailwind CSS is properly configured (it is in your project)
- Check that dark mode works: Toggle theme in your app
- Brand colors should use your theme's --color-brand variables

## API Contract

**Endpoint**: `POST /api/v1/chat`

**Request**:

```json
{
  "message": "How can I reduce my electricity bill?"
}
```

**Response**:

```json
{
  "reply": "Here are some practical tips to reduce your electricity consumption..."
}
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Next Steps (Optional)

1. **Analytics**: Log messages to track user interactions
2. **Persistence**: Store chat history in localStorage
3. **Multi-turn Memory**: Remember conversation context
4. **Typing Indicators**: Show "Assistant is typing..." state
5. **Rich Messages**: Support formatted responses with code blocks
6. **Rating System**: Let users rate responses

---

**All done!** Your Energy Concierge Chat is live on every page. 🚀
