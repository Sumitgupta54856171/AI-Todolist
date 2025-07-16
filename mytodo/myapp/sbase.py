from supabase import create_client
import os
supabse_usrl = os.getenv('url')
supabase_secret = os.getenv('url_secret')
# Initialize Supabase client with error handling
try:
    supabase = create_client(supabse_usrl,supabase_secret)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None  # This allows graceful degradation