# LightBulb

Welcome to **LightBulb**, your go-to platform for discovering the latest insights and connecting with a vibrant community. Our blog and community platform offers a wealth of knowledge and a supportive network for passionate individuals. Explore thought-provoking articles, engage in discussions, and connect with like-minded people.

## Features

### Blogging
- **Create and Delete Blogs:** Users can easily create and remove their blog posts.
- **Advanced Text Editing:** Blogs support a variety of text editing features, similar to Google Docs.
- **LaTeX Rendering:** Our scripts enable LaTeX to be rendered into images that are automatically added to blogs, allowing users to write LaTeX and see the rendered image directly in their editor.
- **Drafts:** Users can save their blogs as drafts and come back to finish them later.
- **Comments and Replies:** Users can comment on blog posts and reply to other comments, fostering engaging discussions.
- **Likes/Unlikes:** Users can like or unlike blog posts to show their appreciation.

### Community
- **Create Communities:** Users can create new communities and post blogs within specific communities.
- **Join Communities:** Other users can join these communities and contribute by posting their blogs.
- **Community Members:** Users can view all members within a community, enhancing the sense of belonging.

### Social Interaction
- **Follow/Unfollow Users:** Users can follow or unfollow other users to stay updated on their latest posts.
- **Profile Editing:** Users can edit their profile information to keep it current.

### Search Functionality
- **Comprehensive Search:** A powerful search bar allows users to search for both blogs and other users within LightBulb.

## Technology Stack
- **Frontend:** React, KaTeX for rendering LaTeX.
- **Backend:** MongoDB, MiKTeX and pdflatex for converting LaTeX to PDFs and then to images, FastAPIs.

## Getting Started

### Prerequisites
- Ensure you have Node.js and npm installed for the frontend.
- Ensure you have Python and MongoDB installed for the backend.
- Install MiKTeX and pdflatex for LaTeX rendering.

### Installation

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/yourusername/lightbulb.git
   cd lightbulb
   ```

2. **Frontend Setup:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```sh
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

### Usage
- Open your browser and navigate to `http://localhost:5173` or `http://localhost:5174` for the frontend.
- The backend server runs on `http://localhost:8000`.

## Conclusion

- **Enhanced Blogging Experience:** We integrated advanced text editing and LaTeX rendering, resulting in a more robust and user-friendly blogging platform.
- **Community Building:** We enabled the creation and participation in communities, fostering stronger connections and collaborative content creation.
- **User Engagement:** By implementing likes, comments, and follows, we increased user interaction and engagement within the platform.
- **Efficient Search:** Our comprehensive search functionality improved content discoverability, enhancing user satisfaction.
- **User-Friendly Interface:** By leveraging React for the frontend, we ensured a responsive and intuitive user interface, enhancing the overall user experience.
- **Secure and Scalable Backend:** Utilizing FastAPIs and MongoDB, we created a secure and scalable backend infrastructure, ensuring reliable performance and data integrity.
- **Profile Customization:** We provided users with the ability to edit their profiles, resulting in a personalized and engaging user experience.
- **Content Drafting:** Implementing draft functionality allowed users to save their work and return to it later, increasing user convenience and productivity.
