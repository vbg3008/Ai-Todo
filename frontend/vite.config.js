import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Vite Config - Environment Variables:");
  console.log("VITE_SUPABASE_URL:", env.VITE_SUPABASE_URL);
  console.log("VITE_SUPABASE_ANON_KEY exists:", !!env.VITE_SUPABASE_ANON_KEY);

  return {
    plugins: [react() , tailwindcss()],
    define: {
      // Make env variables available globally in the app
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL
      ),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY
      ),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  };
});
