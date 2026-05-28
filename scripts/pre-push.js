const { execSync } = require('child_process');

try {
  const branch = execSync('git symbolic-ref --short HEAD').toString().trim();
  if (branch === 'main') {
    console.error('Error: Direct push to the main branch is not allowed. Please open a pull request.');
    process.exit(1);
  }
} catch (error) {
  // Ignore errors if git is not initialized or in detached HEAD state
}
