const socket = io();

// Submit flag event
document.getElementById('flagForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const flag = document.getElementById('flagInput').value;
  const userId = document.getElementById('userId').value; // Assuming userId is available on the page

  // Emit the flag submission event
  socket.emit('submitFlag', { flag, userId });

  // Clear the input
  document.getElementById('flagInput').value = '';
});

// Listen for score updates
socket.on('updateScore', (data) => {
  const userScoreElement = document.getElementById(`score-${data.userId}`);
  if (userScoreElement) {
    userScoreElement.textContent = `Score: ${data.score}`;
  }
});

// Listen for leaderboard updates
socket.on('updateLeaderboard', (users) => {
  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.innerHTML = '';

  users.forEach((user, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${user.username} - ${user.score} points`;
    leaderboardElement.appendChild(listItem);
  });
});
