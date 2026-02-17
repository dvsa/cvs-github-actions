"""Fetch JIRA Tickets and Projects"""
from jira import JIRA as Jira
from dataclasses import dataclass

from variables import (
    JIRA_EMAIL,
    JIRA_KEY,
    JIRA_SERVER,
    PROJECT_ID,
    TICKET_FIELDS
)

from .helpers import cache, logger, Any

@cache
def fetch_projects(file: str, jira: Jira) -> Any:
   return { project.key for project in jira.projects()}

@cache
def fetch_tickets(file: str, project: str, jira: Jira) -> Any:
    tickets: dict[str, dict[str, str]] = dict()
    
    for ticket in jira.search_issues(f"project = {project}", fields = f"{','.join(TICKET_FIELDS)}", maxResults=False):
        tickets[ticket.key] = dict(
            status = ticket.fields.status.name,
            assignee = "None" if ticket.fields.assignee is None else ticket.fields.assignee.displayName,
            reporter = ticket.fields.reporter.displayName
        )
    return tickets

@dataclass
class JiraCache():
    def __init__(self):
        logger.info(f"Creating Jira Connection to {JIRA_SERVER}")
        jira = Jira(server=JIRA_SERVER, basic_auth=(JIRA_EMAIL, JIRA_KEY))
        self.projects = fetch_projects(file = "projects", jira = jira)
        self.tickets = fetch_tickets(file = "tickets", project = PROJECT_ID, jira = jira)
        jira.close()

jira = JiraCache()
TICKETS = jira.tickets
PROJECTS = jira.projects
