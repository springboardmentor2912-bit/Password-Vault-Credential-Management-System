function PasswordStrength({ password }) {

    let strength = "Weak";

    if (
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[@#$%&*!?]/.test(password)
    ) {

        strength = "Strong";

    } else if (password.length >= 8) {

        strength = "Medium";
    }

    return (
        <h4>Password Strength : {strength}</h4>
    );
}

export default PasswordStrength;