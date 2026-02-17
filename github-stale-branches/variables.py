from dotenv import load_dotenv 

import os, sys

load_dotenv()

# Get Secret Variables
GHA_TOKEN: str = str(os.getenv("GHA_TOKEN"))
JIRA_SERVER: str = str(os.getenv("JIRA_SERVER"))
JIRA_EMAIL: str = str(os.getenv("JIRA_EMAIL"))
JIRA_KEY: str = str(os.getenv("JIRA_KEY"))

# Get Repository Name from 
REPOSITORY: str = f"dvsa/{sys.argv[1] if len(sys.argv) > 1 else 'cvs-tf'}" 
TICKET_FIELDS = ["reporter", "assignee", "status"]

APPROVED_FORMAT: str = r"(\w+)\/((?:[a-zA-Z\d]+)-\d+)[a-zA-Z\-_]*[\-\d]*$"
PROJECT_ID: str = "CB2"
PROTECTED_BRANCHES: list[str] = [
  "develop",
  "main",
  "master",
  "devops",
  "VTM-1",
  "VTM-2",
  "VTMDEV-1",
  "VTMDEV-2",
  "destroy-environment",
  "github-pages",
  "gh-pages",
  "preprod",
  "integration",
  "release-please"
]
BRANCH_TYPES: list[str] = [
  "release",
  "protected",
  "pull_request",
  "non_standard",
  "non_cvs",
  "stale",
  "done"
]

# Class for Pretty Text
class console_colours:
  HEADER: str = '\033[34m\033[1m'
  OKBLUE: str = '\033[94m'
  OKCYAN: str = '\033[96m'
  OKGREEN: str = '\033[92m'
  WARNING: str = '\033[93m'
  FAIL: str = '\033[91m'
  BOLD: str = '\033[1m'
  UNDERLINE: str = '\033[4m'
  RESET: str = '\033[0m'