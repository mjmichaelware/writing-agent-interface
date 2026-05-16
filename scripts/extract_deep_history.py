import os
import json
import time
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# Paths - Secrets stay OUTSIDE the app
SECRETS_DIR = os.path.expanduser('~/.gdrive_secrets')
CREDENTIALS_PATH = os.path.join(SECRETS_DIR, 'credentials.json')
TOKEN_PATH = os.path.join(SECRETS_DIR, 'token.json')

# Paths - Data writes INSIDE the app
BASE_DIR = os.path.expanduser('~/writing-agent-interface')
MANIFEST_PATH = os.path.join(BASE_DIR, 'data-layer/ingestion-buffer/old_file_manifest.txt')
OUTPUT_PATH = os.path.join(BASE_DIR, 'data-layer/version-archive/ema_history.json')

def authenticate():
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            # Using port 8080 as it's more stable for Termux/Android redirects
            creds = flow.run_local_server(port=8080, open_browser=False)
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())
    return creds

def get_file_revisions(service, file_id):
    try:
        revisions = service.revisions().list(fileId=file_id, fields="revisions(id,modifiedTime)").execute()
        return revisions.get('revisions', [])
    except Exception as e:
        print(f"  [!] Failed to fetch revisions: {e}")
        return []

def main():
    print("\n=== INITIALIZING SECURE EMA HISTORY EXTRACTION ===")
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    with open(MANIFEST_PATH, 'r') as f:
        filenames = [line.strip() for line in f if line.strip()]

    print(f"Loaded {len(filenames)} target files from manifest.")
    print("Beginning extraction. This may take a few minutes...\n")

    ema_memory_bank = {}
    total_found = 0

    for filename in filenames:
        safe_name = filename.replace("'", "\\'")
        query = f"name = '{safe_name}' and trashed = false"
        
        try:
            results = service.files().list(q=query, spaces='drive', fields="files(id, name)", pageSize=10).execute()
            items = results.get('files', [])

            if not items:
                continue
                
            for item in items:
                file_id = item['id']
                file_name = item['name']
                print(f"Extracting history for: {file_name}")
                
                revisions = get_file_revisions(service, file_id)
                
                ema_memory_bank[file_id] = {
                    "filename": file_name,
                    "revisions": revisions,
                    "total_edits": len(revisions)
                }
                total_found += 1
                time.sleep(0.25)
                
        except Exception as e:
            print(f"[!] Search failed for {filename}: {e}")

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(ema_memory_bank, f, indent=2)

    print(f"\n=== EXTRACTION COMPLETE ===")
    print(f"Mapped deep history for {total_found} files.")
    print(f"EMA Memory Bank securely saved to: {OUTPUT_PATH}")

if __name__ == '__main__':
    main()
