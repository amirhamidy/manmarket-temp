document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form');
    if (signupForm) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const confirmPasswordError = document.getElementById('confirm-password-error');
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');

        function checkPasswordMatch() {
            if (passwordInput && confirmPasswordInput && confirmPasswordError) {
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;

                if (confirmPassword.length > 0 && password !== confirmPassword) {
                    confirmPasswordError.classList.remove('d-none');
                    confirmPasswordInput.classList.add('is-invalid');
                } else {
                    confirmPasswordError.classList.add('d-none');
                    confirmPasswordInput.classList.remove('is-invalid');
                }
            }
        }

        if (passwordInput && confirmPasswordInput) {
            passwordInput.addEventListener('input', checkPasswordMatch);
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }

        if (emailInput && emailError) {
            emailInput.addEventListener('input', function() {
                if (!emailInput.validity.valid && emailInput.value.length > 0) {
                    emailError.classList.remove('d-none');
                    emailInput.classList.add('is-invalid');
                } else {
                    emailError.classList.add('d-none');
                    emailInput.classList.remove('is-invalid');
                }
            });
        }

        document.querySelectorAll('.sing-toggle-password').forEach(toggleButton => {
            toggleButton.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const passwordField = document.getElementById(targetId);
                if (passwordField && passwordField.type === 'password') {
                    passwordField.type = 'text';
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em">
                            <path fill="currentColor" d="M5.22 12.549c.856.29 1.783.451 2.78.451c3.462 0 6.094-1.955 7.826-4.433a1.01 1.01 0 0 0 0-1.134c-.74-1.06-1.646-2.024-2.71-2.78l-.725.724c1.029.7 1.901 1.618 2.604 2.632C13.438 10.234 11.06 12 8 12a7.6 7.6 0 0 1-1.975-.257zm1.735-1.736a3 3 0 0 0 3.858-3.858l-.825.825A2 2 0 0 1 7.78 9.988zM6.012 8.22l-.825.825a3 3 0 0 1 3.858-3.858l-.825.825A2 2 0 0 0 6.012 8.22m3.963-3.963A7.6 7.6 0 0 0 8 4C4.938 4 2.558 5.769 1.007 7.987c.702 1.016 1.574 1.935 2.603 2.636l-.726.725C1.82 10.59.914 9.628.173 8.568a1.02 1.02 0 0 1 .006-1.145C1.905 4.955 4.537 3 8 3a8.6 8.6 0 0 1 2.782.452zM1.854 14.854a.5.5 0 0 1-.708-.708l13-13a.5.5 0 0 1 .708.708z"></path>
                        </svg>
                    `;
                } else if (passwordField) {
                    passwordField.type = 'password';
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em">
                            <g fill="none" stroke="currentColor">
                                <circle cx="8" cy="8" r="2.5"></circle>
                                <path strokeLinecap="round" d="M15.42 8.29c.12-.18.12-.4 0-.58c-.7-1-3.28-4.21-7.42-4.21S1.28 6.71.58 7.71c-.12.18-.12.4 0 .58c.7 1 3.28 4.21 7.42 4.21s6.72-3.21 7.42-4.21z"></path>
                            </g>
                        </svg>
                    `;
                }
            });
        });

        signupForm.addEventListener('submit', function(event) {
            if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
                event.preventDefault();
                confirmPasswordError.classList.remove('d-none');
                confirmPasswordInput.classList.add('is-invalid');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        document.querySelectorAll('.logix-toggle-password').forEach(toggleButton => {
            toggleButton.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const passwordField = document.getElementById(targetId);
                if (passwordField && passwordField.type === 'password') {
                    passwordField.type = 'text';
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em">
                            <path fill="currentColor" d="M5.22 12.549c.856.29 1.783.451 2.78.451c3.462 0 6.094-1.955 7.826-4.433a1.01 101 0 0 0 0-1.134c-.74-1.06-1.646-2.024-2.71-2.78l-.725.724c1.029.7 1.901 1.618 2.604 2.632C13.438 10.234 11.06 12 8 12a7.6 7.6 0 0 1-1.975-.257zm1.735-1.736a3 3 0 0 0 3.858-3.858l-.825.825A2 2 0 0 1 7.78 9.988zM6.012 8.22l-.825.825a3 3 0 0 1 3.858-3.858l-.825.825A2 2 0 0 0 6.012 8.22m3.963-3.963A7.6 7.6 0 0 0 8 4C4.938 4 2.558 5.769 1.007 7.987c.702 1.016 1.574 1.935 2.603 2.636l-.726.725C1.82 10.59.914 9.628.173 8.568a1.02 102 0 0 1 .006-1.145C1.905 4.955 4.537 3 8 3a8.6 8.6 0 0 1 2.782.452zM1.854 14.854a.5.5 0 0 1-.708-.708l13-13a.5.5 0 0 1 .708.708z"></path>
                        </svg>
                    `;
                } else if (passwordField) {
                    passwordField.type = 'password';
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em">
                            <g fill="none" stroke="currentColor">
                                <circle cx="8" cy="8" r="2.5"></circle>
                                <path strokeLinecap="round" d="M15.42 8.29c.12-.18.12-.4 0-.58c-.7-1-3.28-4.21-7.42-4.21S1.28 6.71.58 7.71c-.12.18-.12.4 0 .58c.7 1 3.28 4.21 7.42 4.21s6.72-3.21 7.42-4.21z"></path>
                            </g>
                        </svg>
                    `;
                }
            });
        });
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
    }
});