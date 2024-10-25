## Developing 🛠️

### Prerequisites 📋

1. Clone the project repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration ⚙️

1. Create a new `.env` file using the template from `.env.example` 📄
2. Configure the following environment variables:
   ```
   PUBLIC_CDN_URL=https://cdn.scoresaber.com
   PUBLIC_API_URL=https://scoresaber.com
   ```
   📝 Note: CORS is currently enabled for both the CDN and the API. This configuration will be improved in future updates.

### Starting the Development Server 🖥️

Run the following command to start the development server with HTTPS:

```bash
npm run dev -- --https
```

## Building for Production 🏗️

To build the app for production:

```bash
npm run build
```

### Preview the Built App 👀

You can preview the built app using:

```bash
npm run preview
```

> ⚠️ **Important:** The preview command should not be used to serve ScoreSaber in production environments.
