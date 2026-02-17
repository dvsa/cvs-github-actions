"""Output a JSON file with specific branch criteria from a givem Repository"""
from variables import (
    GHA_TOKEN,
    REPOSITORY,
    sys,
    os
)
from utils import Branches, github, json
from typing import Hashable, Any

import json

def main():
    gh = github(GHA_TOKEN)
    branches = Branches(gh)
    
    # Output JSON Files
    output: dict[Hashable, Any] = dict()
    output = {
        **branches.stale, # Includes Pull Requests by design
        **branches.non_standard,
        **branches.done
    }

    with open(f"{REPOSITORY.split('/')[1]}.json", "w") as file:
        file.write(json.dumps(output))

if __name__ == "__main__":
    if len(sys.argv) > 1 or bool(os.getenv("DEV")):
        main()