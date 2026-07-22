Create a new repository-specific agent for this workspace.

Workflow:
1. Create a markdown file in .claude/agents/ with a clear name and description.
2. Include concise repo context so the agent understands this project.
3. Use frontmatter with name, description, and tools when appropriate.
4. Keep the instructions focused on the current site’s structure, languages, and local workflow.
5. If the agent is meant for this website, mention that the project is a Traditional-Chinese static cultural site served via node server.js.

Output:
- A new agent file under .claude/agents/
- A short explanation of what the agent is designed to help with
