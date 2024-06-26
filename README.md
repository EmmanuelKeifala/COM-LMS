# University Notes Hosting Platform

This project is a web platform designed to host university notes along with associated YouTube videos. The notes are organized into courses, providing an integrated learning experience for students.

## Tech Stack

- **Next.js 13**: A React framework for building modern web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **MongoDB**: A NoSQL database for storing and managing data efficiently.
- **UploadThing**: A file upload library for handling file uploads seamlessly.
- **ShadCN**: Re-usable components built using Radix UI and Tailwind CSS..
- **Clerk**: An authentication and user management system for Next.js applications.
- **Pusher**: For instant Messaging.
- **Sanity:** As a CMS
- **OpenAI**
- **Libgen:** For it vast db of books

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB instance set up.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EmmanuelKeifala/COM-LMS.git
   cd COM-LMS
   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Set up environment variables:**
   ```NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      CLERK_SECRET_KEY
      DATABASE_URL
      UPLOADTHING_SECRET
      UPLOADTHING_APP_ID
      NEXT_PUBLIC_APP_URL
      NEXT_PUBLIC_UPLOADER_IDS
      GOOGLE_ANALYTICS_ID
      SMTP_PASSWORD
      SMTP_MAIL
      EMAIL_SERVICE
      EMAIL_PORT
      EMAIL_HOST
   ```
4. **Run the application:**
   `npm run dev`

# Features

- **Courses:** Organize notes into courses for easy navigation.
- **YouTube Integration:** Attach YouTube videos to enhance learning.
- **User Authentication:** Secure user authentication provided by Clerk.
- **File Uploads:** Seamless file uploads using UploadThing.
- **Blog:** A nice a cool student blog to keep them updated.
- **Quiz:** Students can also generate quizzes all with the power of AI
- **Library:** A library as well! students can search for books and download
- **In Course ChatBox:** Students can have discussions with an AI trained on the course they are presently in 
- **Responsive Design:** Tailwind CSS ensures a responsive and visually appealing UI.

_Feel free to explore and enhance the platform based on your requirements!_
