<?php
// send_email.php

// Set response header to JSON (good practice for API-like responses)
header('Content-Type: application/json');

// Check if the form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    // --- Email Sending Configuration ---
    $to = "jerseyzenith88@gmail.com"; // **IMPORTANT: Replace with your actual email address**
    $subject = "New Contact Form Submission from Portfolio: " . $name;
    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Email body
    $email_body = "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n\n";
    $email_body .= "Message:\n" . $message . "\n";

    // Attempt to send the email
    if (mail($to, $subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);
    } else {
        // Log the error for debugging (check your server's PHP error logs)
        error_log("Failed to send email from " . $email . " to " . $to);
        echo json_encode(['success' => false, 'message' => 'Failed to send your message. Please try again later.']);
    }

} else {
    // If accessed directly without POST request
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
