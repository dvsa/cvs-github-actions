from github import Github, Auth, PaginatedList, Repository
from datetime import date
from dataclasses import dataclass

from variables import (
  APPROVED_FORMAT,
  PROJECT_ID,
  PROTECTED_BRANCHES,
  REPOSITORY,
  TICKET_FIELDS,
  BRANCH_TYPES
)
from typing import Hashable
from .helpers import Any, cache, logger
from .jira_utility import PROJECTS, TICKETS

import re, pandas

def github(auth: str, ) -> Github:
   """Create a connection to GitHub with log output"""
   logger.info("Creating GitHub Connection")
   gh = Github(auth=Auth.Token(auth), per_page=100)
   return gh

def get_pr_branches(pr: PaginatedList.PaginatedList)-> set[str]:
  """Return branch name for a given pull request"""
  return set(p.head.ref for p in pr)
   
def valid_ticket(branch: str) -> str | None:
  """Return the Ticket ID if it uses a standard name"""
  ticket = re.findall(APPROVED_FORMAT, branch)
  if ticket and len(ticket) == 1:
    return ticket[0][1].upper()
  
def ticket_status(branch: str) -> str | None:
  """Get the Status of a given Branch"""
  ticket = valid_ticket(branch)
  if ticket is not None and len(ticket) > 0 and ticket in TICKETS:
    return TICKETS[ticket]["status"]
  
def ticket_detail(ticket: str) -> dict[str, Any] | None:
  if ticket in TICKETS:
    return dict(
      status = TICKETS[ticket]["status"],
      reporter = TICKETS[ticket]["reporter"],
      assignee = TICKETS[ticket]["assignee"]
    )

def is_release(**kwargs) -> bool:
  """Return the branch name if it is a release branch"""
  if kwargs["branch"].startswith("release/v"):
    return True
  else:
    return False
  
def is_non_standard(**kwargs) -> bool | None:
  """Return the branch name if it does not match the standard format"""
  ticket = valid_ticket(kwargs["branch"])
  if ticket is None:
    return True
  elif not ticket.split("-")[0] in PROJECTS:
    return True
  
def is_pull_request(**kwargs) -> bool | None:
  """Return the branch name if the branch is associated with a closed pull request"""
  if kwargs["branch"] in kwargs["pull_requests"]:
    return True
   
def is_non_cvs(**kwargs) -> bool | None:
  """Return the branch name if the Project ID is not for the current Project"""
  ticket = valid_ticket(kwargs["branch"])
  if ticket is not None:
    project = ticket.split("-")[0]
    if project in PROJECTS and not project == PROJECT_ID:
        return True

def is_stale(**kwargs) -> bool | None:
  """Return the branch name if Jira Ticket is no longer required or ticket cannot be located"""
  ticket = ticket_status(kwargs["branch"])
  if ticket in ("Withdrawn", "No Longer Valid"):
      return True

def is_done(**kwargs) -> bool | None:
  """Return the branch name if the branch is "Done" in Jira"""
  ticket = ticket_status(kwargs["branch"])
  if ticket == "Done":
      return True
        
def is_protected(**kwargs) -> bool | None:
  """Compare branch against list of "protected" branches"""
  br: list[str] = re.findall(r"(?:.*/)?(.*)", kwargs["branch"])
  if br:
    sub = [s for s in PROTECTED_BRANCHES if br[0] in s]
    if sub:
      return True

@cache
def get_branches(file: str, repo: Repository.Repository) -> dict[str, dict[str, int]]:
  """Get all branches for a Repository (Cached for local dev)"""
  all_branches: PaginatedList.PaginatedList = repo.get_branches()
  branches: dict[str, dict[str, int]] = {b.name: (date.today() - b.commit.commit.committer.date.date()).days for b in all_branches}

   # Fetch Branch Information
  for branch in all_branches:
    branches[branch.name] = dict(
       age = int((date.today() - branch.commit.commit.committer.date.date()).days)
    )
  return branches

@dataclass
class Branches():
  """Create an object containing the branch status of all GitHub Branches for a Repository"""
  def __init__(self, gh: Github):
    repo = Repository.Repository = gh.get_repo(REPOSITORY)
    self._pull_requests: set[str] = get_pr_branches(pr = repo.get_pulls(state="closed"))
    self._branches: dict[str, dict[str, Any]] = get_branches(file = "branches", repo = repo)

    # Convert to a DataFrame
    branches = pandas.DataFrame(self._branches.values(), columns = ["age"], index = list(self._branches.keys()))
    branches[TICKET_FIELDS] = pandas.NA
    branches[BRANCH_TYPES] = False
    for branch in self._branches:
      ticket = valid_ticket(branch)
      if ticket is not None and ticket in TICKETS:
        details = ticket_detail(ticket)
        if details:
          for detail in TICKET_FIELDS:
            branches.loc[branch, detail] = TICKETS[ticket][detail]
      for type in BRANCH_TYPES:
        if globals()[f"is_{type}"](branch = branch, pull_requests = self._pull_requests):
          branches.loc[branch, type] = True
        
    self.branches = branches

  def _clean(self, type) -> dict[Hashable, Any]:
    """Return a 'flipped' data set containing the requested branch types without protected or release branches"""
    return self.branches.query(f"{type} and not (protected or release)").transpose().to_dict()
  
  def _pure(self, type) -> dict[Hashable, Any]:
    """Return a 'flipped' data set containing the requested branch types without cleaning up protected or release branches"""
    return self.branches.query(type).transpose().to_dict()
  
  @property
  def branch_count(self) -> int:
    return len(self._branches)
  
  @property
  def branch_types(self) -> list[str]:
     return BRANCH_TYPES
  
  @property
  def all_branches(self) -> dict[Hashable, Any]:
     return self.branches.transpose().to_dict()
  
  @property
  def pull_requests(self) -> dict[Hashable, Any]:
     return self._clean("pull_request")
  
  @property
  def protected(self) -> dict[Hashable, Any]:
     return self._pure("protected")
  
  @property
  def release(self) -> dict[Hashable, Any]:
     return self._pure("release")
  
  @property
  def stale(self) -> dict[Hashable, Any]:
     return self._clean("(stale or pull_request)")
  
  @property
  def done(self) -> dict[Hashable, Any]:
     return self._clean("done")
  
  @property
  def non_standard(self) -> dict[Hashable, Any]: 
    return self._clean("non_standard")
  
  @property
  def non_cvs(self) -> dict[Hashable, Any]:
     return self._clean("non_cvs")


