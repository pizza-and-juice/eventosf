# PWR Community 👥

## 1. Project Overview 📘

The PWR Grants Portal is a web-based application that empowers users to apply for innovation grants within the PWR Chain ecosystem. It provides a user-friendly, secure, and structured way for developers and founders to share their ideas and receive funding.

Target Audience:

-   👩‍💻 Blockchain developers
-   🚀 Startup founders
-   🧠 Innovators & researchers
-   🧑‍⚖️ Grant reviewers & admins

## 2. Business Context 💼

The PWR Community Portal is integral to PWR Labs mission of democratizing access to decentralized technologies. It supports:

-   ✍️ Community empowerment through a transparent grant application process.
-   🔐 Showcasing real-world applications of PWR Chain, highlighting its versatility and scalability.

By providing a centralized hub for project visibility and funding opportunities, the portal accelerates the adoption and innovation of PWR Chain technologies.

## 3. Features ✨

-   🖼️ Project Showcase: Highlight and explore projects utilizing PWR Chain.
-   🧾 Grant Applications: Submit proposals for funding to support development and innovation.
-   👨🏻‍💻 User Authentication: Secure login via Google.
-   💬 Community Interactions: Engage with projects through likes, comments, and discussions.
-   📃 Admin Dashboard: Manage projects, applications, and user interactions.
-   🎯 Profile views for applicants to see submission status

## 4. Tech Stack 🛠️

**Frontend:** Vite, ReactJS, TailwindCSS, Typescript
**Form Validation**: Formik + Yup
**Data fetching:** React Query
**Backend:** Java
**Database:** PostgreSQL  
**DevOps/Infra:** Vercel, Digital Ocean Droplets, Digital Ocean Spaces (S3 compatible)

## 4.1 UI Design 🎨

Responsive Tailwind-based layout supporting both light and dark themes. Robust validation messages and dynamic field handling based on user actions.

## 5. Architecture Overview

The portal is structured in modular React components:

-   🏠 LandingPage: Hero section + introduction
-   📝 ApplyForGrantPage: Form with sidebar navigation and validation
-   👤 ProfilePage: Submitted projects and user-specific views
-   🔍 ProjectDetailsPage: Display metadata, votes, and comments
-   🔧 Shared Components: Uploaders, modals, skeletons, toasts

State is managed via context and React Query. Form input flows are controlled by Formik, with API requests handled through a single point QueryApi abstraction.

## 6. Setup & Installation ⚙️

```bash
# Clone the repository
git clone https://github.com/pwrlabs/pwr-grants-portal
cd pwr-grants-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

### 7 .env 🔐

Create a `.env` file in the root directory of the project, using .env.example as a template.

| Variable Name                   | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `VITE_APP_FONTAWESOME_KEY`      | FontAwesome API key                                                      |
| `VITE_APP_API`                  | API URL for the backend                                                  |
| `VITE_APP_GOOGLE_GSI_CLIENT_ID` | Google GSI Client ID, allows to send request to authenticate with google |
| `VITE_APP_X_API_CLIENT_ID`      | X API Client ID, allows to send request to authenticate with X           |
| `VITE_APP_X_API_CLIENT_SECRET`  | X API Client Secret, allows to send request to authenticate with X       |
| `VITE_APP_IMAGE_SERVER_URL`     | URL for the image server                                                 |
| `VITE_APP_IMG_URL`              | Base url for the images                                                  |

## 8. Branching structure 🌿

1. main -> Production-ready
2. dev -> Staging & internal testing
3. feature/\* -> Feature branches

## 9. Status / Roadmap 🚧

Current Status: 🟢 Live

The application is deployed and accessible at https://community.pwrlabs.io

</br>

---

For more information on PWR Chain and its ecosystem, visit the official website: https://www.pwrlabs.io
