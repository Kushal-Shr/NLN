Contribution Guide
Welcome to the team! To win this hackathon, we need to code fast without breaking each other's work. This guide covers the exact steps to manage our code on GitHub.

🚀 1. The Setup (Do this once)
Clone the repository and install the dependencies.

Bash
git clone [YOUR_REPO_URL]
cd sanctuary
npm install
🌿 2. Creating a Feature Branch
Never code on main. Always create a new branch for every task.

Start from the latest code:

Bash
git checkout main
git pull origin main
Create your branch:

Bash
# Replace 'feat/onboarding' with your actual task
git checkout -b feat/your-feature-name
💾 3. Committing & Saving Work
Make small, frequent commits. It’s easier to fix a small mistake than a huge one.

Bash
git add .
git commit -m "feat: added cultural persona selection logic"
🔄 4. How to NOT Conflict (The "Sync" Step)
Do this before you push. This is the most important step to avoid merge conflicts. It pulls your teammates' latest work into your branch so you can fix any issues before they hit the main repo.

Fetch latest changes:

Bash
git fetch origin main
Merge main into your branch:

Bash
git merge origin/main
If there are no conflicts, you’re good to go! If there are, see the "Conflict" section below.

📤 5. Pushing to GitHub
Once your branch is synced and working:

Bash
# The first time you push a new branch:
git push -u origin feat/your-feature-name

# Every time after that:
git push
Next Step: Go to GitHub.com and open a Pull Request (PR). Tag a teammate to review and hit "Squash and Merge."

📥 6. How to Pull Someone Else's Work
If a teammate just merged a cool feature and you want it on your computer:

Bash
git checkout main
git pull origin main
⚠️ 7. How to Resolve a Merge Conflict
Conflicts happen when two people edit the same line of code. Don't panic.

Identify the file: Git will tell you which file is "Both Modified."

Open the file in VS Code: You will see markers like this:

Plaintext
<<<<<<< HEAD (Your local changes)
"Welcome to Sanctuary"
=======
"Welcome to the Resilience Hub" (The change from main)
>>>>>>> main
Choose: Delete the markers and the version you don't want, or combine them.

Save and Finish:

Bash
git add [FILENAME]
git commit -m "chore: resolved merge conflict"
🔒 8. The "Secrets" Rule
Never push .env or .env.local files. * If you add a new API key (Gemini, Render, etc.), add it to .env.example (leave the value blank).

Message the team in the group chat to update their local files.

📁 9. Role-Based Folder Ownership
To further reduce conflicts, try to stay within your assigned folders:

Frontend A: app/layout.tsx, components/ui/

Frontend B: app/onboarding/, app/board/

Backend: prisma/schema.prisma, lib/db.ts
