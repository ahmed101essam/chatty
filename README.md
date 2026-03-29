# Chatty Backend Progress

## ✅ Completed Features

### Models

- `User` model:
  - `email` (required, unique)
  - `fullName` (required)
  - `password` (required, min length 8)
  - `profilePic` (default: "")
  - timestamps enabled

- `Message` model:
  - `senderId` (ObjectId, ref:"User", required)
  - `receiverId` (ObjectId, ref:"User", required)
  - `text` (optional, trim, maxlength 2000)
  - `image` (optional)
  - timestamps enabled

### Controllers (`backend/src/controllers/message.controller.js`)

- `getAllContacts`:
  - returns all users except currently authenticated user
  - excludes password field
  - route: `GET /contacts`

- `getMessages`:
  - returns all messages between logged-in user and user ID from params
  - route: `GET /:id`
  - sorts messages by createdAt ascending

- `sendMessage`:
  - send text and/or image in conversation with user ID from params
  - verifies sender cannot message self
  - verifies receiver exists
  - uploads image to Cloudinary if provided and stores `secure_url`
  - route: `POST /send/:id`

- `getChatPartnerIds` (refactored from stub):
  - finds unique chat partners in Message collection for logged-in user
  - returns partner user objects (`fullName`, `email`, `profilePic`) in recency order
  - route: `GET /chats`

## 🛡️ Authentication / Middleware

- `arcjetPortection` and `protectRoute` applied on message routes in `backend/src/routes/message.route.js`

## 📌 Notes

- `getChatPartnerIds` and `getMessages` are now wired with `GET /chats` and `GET /:id` respectively.
- `sendMessage` handles both text-only, image-only, and text+image payloads.
- Error handling for all message controller methods returns HTTP 500 on server error.

## ▶️ Next steps

- implement pagination for `/chats` and `/messages/:id` for scaling
- add message deletion/edit endpoints
- integrate frontend calling patterns for all message endpoints
- add more robust validation and tests
