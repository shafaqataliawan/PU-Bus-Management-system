document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  // Check if user is admin
  const role = localStorage.getItem('userRole');
  if (role !== 'admin') {
    window.location.href = '/index.html';
    return;
  }
  // Handle form submissions
  document.getElementById('generalSettingsForm').addEventListener('submit', handleGeneralSettings);
  document.getElementById('notificationSettingsForm').addEventListener('submit', handleNotificationSettings);
  document.getElementById('securitySettingsForm').addEventListener('submit', handleSecuritySettings);
  document.getElementById('backupSettingsForm').addEventListener('submit', handleBackupSettings);
});

function handleGeneralSettings(e) {
  e.preventDefault();
  // Implement settings save logic here
  alert('General settings saved successfully!');
}

function handleNotificationSettings(e) {
  e.preventDefault();
  // Implement notification settings save logic here
  alert('Notification preferences updated!');
}

function handleSecuritySettings(e) {
  e.preventDefault();
  // Implement security settings save logic here
  alert('Security settings updated successfully!');
}

function handleBackupSettings(e) {
  e.preventDefault();
  // Implement backup settings save logic here
  alert('Backup settings saved successfully!');
} 