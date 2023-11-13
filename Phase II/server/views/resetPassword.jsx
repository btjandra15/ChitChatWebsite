const React = require('react');

const ResetPassword = ({ email, status }) => (
  <div style={styles.container}>
    <div style={styles.formContainer}>
      <h1 style={styles.title}>Reset Your Password</h1>
      <p style={styles.subtitle}>Please enter your new password below:</p>
      <form action="" method="post" style={styles.form}>
        <input type="hidden" name="email" value={email} />
        <label htmlFor="password" style={styles.label}>
          New Password:
        </label>
        <input type="password" name="password" id="password" required style={styles.input} />
        <br />
        <label htmlFor="confirmPassword" style={styles.label}>
          Confirm Password:
        </label>
        <input type="password" name="confirmPassword" id="confirmPassword" required style={styles.input} />
        <br />
        <button 
        type="submit" 
        style={styles.button}
        onClick={() => {
            console.log('Button clicked');
            if (status === 'Verified') {
              console.log('Status is verified');
              const confirmed = window.confirm('Password reset successful. Do you want to log in?');
              console.log('Confirmation result:', confirmed);
              if (confirmed) {
                console.log('Redirecting to login page');
                window.location.href = 'http://localhost:3000/login'; // Adjust the URL accordingly
              }
            }
          }}
        >
          Reset Password
        </button>
      </form>
    </div>
  </div>
);

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    formContainer: {
      width: '400px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      margin: '0 0 20px',
    },
    subtitle: {
      textAlign: 'center',
      margin: '0 0 20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      margin: '10px 0',
    },
    input: {
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px',
      borderRadius: '4px',
      background: '#007BFF',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
    },
  };

module.exports = ResetPassword;